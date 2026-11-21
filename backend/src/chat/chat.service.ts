import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getConversationMessages(userId: string, conversationId: string, page = 1, limit = 50) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { match: true },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation introuvable');
    }

    if (
      conversation.match.user1Id !== userId &&
      conversation.match.user2Id !== userId
    ) {
      throw new ForbiddenException('Accès refusé à cette conversation');
    }

    const skip = (page - 1) * limit;

    const [total, messages] = await Promise.all([
      this.prisma.message.count({ where: { conversationId } }),
      this.prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          attachments: true,
          sender: {
            select: {
              id: true,
              profile: {
                select: {
                  displayName: true,
                  photos: { where: { isMain: true } },
                },
              },
            },
          },
        },
      }),
    ]);

    return {
      total,
      page,
      limit,
      messages: messages.map((m) => ({
        id: m.id,
        conversationId: m.conversationId,
        senderId: m.senderId,
        senderName: m.sender.profile?.displayName,
        senderPhoto: m.sender.profile?.photos[0]?.url || null,
        content: m.content,
        isRead: m.isRead,
        readAt: m.readAt,
        createdAt: m.createdAt,
        attachments: m.attachments.map((a) => ({
          id: a.id,
          fileUrl: a.fileUrl,
          fileType: a.fileType,
          duration: a.duration,
        })),
      })),
    };
  }

  async sendMessage(senderId: string, dto: SendMessageDto) {
    if (!dto.content && (!dto.attachments || dto.attachments.length === 0)) {
      throw new BadRequestException('Un message doit comporter du texte ou une pièce jointe');
    }

    const conversation = await this.prisma.conversation.findUnique({
      where: { id: dto.conversationId },
      include: { match: true },
    });

    if (!conversation || !conversation.match.isActive) {
      throw new NotFoundException('Conversation introuvable ou inactive');
    }

    const { user1Id, user2Id } = conversation.match;
    if (user1Id !== senderId && user2Id !== senderId) {
      throw new ForbiddenException('Vous ne participez pas à ce match');
    }

    const recipientId = user1Id === senderId ? user2Id : user1Id;

    // Check blocks
    const isBlocked = await this.prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: senderId, blockedId: recipientId },
          { blockerId: recipientId, blockedId: senderId },
        ],
      },
    });

    if (isBlocked) {
      throw new ForbiddenException('Impossible d envoyer ce message : échange bloqué');
    }

    // Create message with attachments and update conversation in transaction
    const message = await this.prisma.message.create({
      data: {
        conversationId: dto.conversationId,
        senderId,
        content: dto.content ? dto.content.trim() : null,
        attachments: dto.attachments && dto.attachments.length > 0
          ? {
              create: dto.attachments.map((a) => ({
                fileUrl: a.fileUrl,
                fileType: a.fileType,
                duration: a.duration,
              })),
            }
          : undefined,
      },
      include: {
        attachments: true,
        sender: {
          select: {
            id: true,
            profile: {
              select: {
                displayName: true,
                photos: { where: { isMain: true } },
              },
            },
          },
        },
      },
    });

    await this.prisma.conversation.update({
      where: { id: dto.conversationId },
      data: { updatedAt: new Date() },
    });

    // Notify recipient
    await this.prisma.notification.create({
      data: {
        userId: recipientId,
        title: `Nouveau message de ${message.sender.profile?.displayName || 'un match'}`,
        body: dto.content
          ? dto.content.length > 50
            ? dto.content.substring(0, 50) + '...'
            : dto.content
          : 'Vous a envoyé un média',
        type: 'MESSAGE',
        data: { conversationId: dto.conversationId, messageId: message.id },
      },
    });

    return {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      senderName: message.sender.profile?.displayName,
      senderPhoto: message.sender.profile?.photos[0]?.url || null,
      content: message.content,
      isRead: message.isRead,
      createdAt: message.createdAt,
      attachments: message.attachments.map((a) => ({
        id: a.id,
        fileUrl: a.fileUrl,
        fileType: a.fileType,
        duration: a.duration,
      })),
      recipientId,
    };
  }

  async markAsRead(userId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { match: true },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation introuvable');
    }

    if (conversation.match.user1Id !== userId && conversation.match.user2Id !== userId) {
      throw new ForbiddenException('Accès refusé');
    }

    const updated = await this.prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return { success: true, count: updated.count };
  }
}
