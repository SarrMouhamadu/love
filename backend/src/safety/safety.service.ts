import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReportUserDto } from './dto/safety.dto';

@Injectable()
export class SafetyService {
  constructor(private readonly prisma: PrismaService) {}

  async blockUser(blockerId: string, blockedId: string) {
    if (blockerId === blockedId) {
      throw new BadRequestException('Vous ne pouvez pas vous bloquer vous-même');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: blockedId },
    });

    if (!targetUser) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    await this.prisma.block.upsert({
      where: {
        blockerId_blockedId: { blockerId, blockedId },
      },
      create: { blockerId, blockedId },
      update: {},
    });

    // Automatically deactivate any active match between them
    await this.prisma.match.updateMany({
      where: {
        OR: [
          { user1Id: blockerId, user2Id: blockedId },
          { user1Id: blockedId, user2Id: blockerId },
        ],
      },
      data: { isActive: false },
    });

    return { success: true, message: 'Utilisateur bloqué avec succès' };
  }

  async unblockUser(blockerId: string, blockedId: string) {
    await this.prisma.block.deleteMany({
      where: { blockerId, blockedId },
    });
    return { success: true, message: 'Utilisateur débloqué avec succès' };
  }

  async getBlockedUsers(userId: string) {
    const blocks = await this.prisma.block.findMany({
      where: { blockerId: userId },
      include: {
        blocked: {
          include: {
            profile: {
              select: { displayName: true, city: true, photos: { where: { isMain: true } } },
            },
          },
        },
      },
    });

    return blocks.map((b) => ({
      blockedId: b.blockedId,
      displayName: b.blocked.profile?.displayName,
      photoUrl: b.blocked.profile?.photos[0]?.url || null,
      blockedAt: b.createdAt,
    }));
  }

  async reportUser(reporterId: string, dto: ReportUserDto) {
    if (reporterId === dto.reportedUserId) {
      throw new BadRequestException('Vous ne pouvez pas vous signaler vous-même');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: dto.reportedUserId },
    });

    if (!targetUser) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const report = await this.prisma.report.create({
      data: {
        reporterId,
        reportedId: dto.reportedUserId,
        reason: dto.reason,
        details: dto.details ? dto.details.trim() : null,
      },
    });

    return {
      success: true,
      message: 'Signalement transmis à l équipe de modération',
      reportId: report.id,
    };
  }
}
