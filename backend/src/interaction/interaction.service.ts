import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DiscoveryQueryDto } from './dto/discovery-query.dto';
import { UserStatus } from '@prisma/client';

const FREE_USER_DAILY_LIKE_LIMIT = 20;

@Injectable()
export class InteractionService {
  constructor(private readonly prisma: PrismaService) {}

  async getDiscoveryProfiles(currentUserId: string, query: DiscoveryQueryDto) {
    const currentUser = await this.prisma.user.findUnique({
      where: { id: currentUserId },
      include: { profile: true },
    });

    if (!currentUser || !currentUser.profile) {
      throw new NotFoundException('Profil utilisateur introuvable');
    }

    // 1. Get IDs of users already liked or passed
    const [likesSent, passesSent, blocksGiven, blocksReceived] = await Promise.all([
      this.prisma.like.findMany({
        where: { fromUserId: currentUserId },
        select: { toUserId: true },
      }),
      this.prisma.pass.findMany({
        where: { fromUserId: currentUserId },
        select: { toUserId: true },
      }),
      this.prisma.block.findMany({
        where: { blockerId: currentUserId },
        select: { blockedId: true },
      }),
      this.prisma.block.findMany({
        where: { blockedId: currentUserId },
        select: { blockerId: true },
      }),
    ]);

    const excludedUserIds = new Set<string>([
      currentUserId,
      ...likesSent.map((l) => l.toUserId),
      ...passesSent.map((p) => p.toUserId),
      ...blocksGiven.map((b) => b.blockedId),
      ...blocksReceived.map((b) => b.blockerId),
    ]);

    // 2. Compute date range for age filter
    const minAge = query.minAge ?? currentUser.profile.searchMinAge;
    const maxAge = query.maxAge ?? currentUser.profile.searchMaxAge;
    const now = new Date();
    const maxBirthDate = new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());
    const minBirthDate = new Date(now.getFullYear() - maxAge - 1, now.getMonth(), now.getDate());

    const targetGender = query.gender ?? currentUser.profile.searchGender;

    // 3. Query candidate profiles
    const profiles = await this.prisma.profile.findMany({
      where: {
        userId: { notIn: Array.from(excludedUserIds) },
        incognitoMode: false,
        birthDate: {
          gte: minBirthDate,
          lte: maxBirthDate,
        },
        ...(targetGender ? { gender: targetGender } : {}),
        ...(query.city ? { city: { equals: query.city, mode: 'insensitive' } } : {}),
        user: {
          status: UserStatus.ACTIVE,
          ...(query.onlyVerified ? { isVerified: true } : {}),
        },
      },
      include: {
        photos: { orderBy: { order: 'asc' } },
        interests: { include: { interest: true } },
        user: {
          select: {
            id: true,
            isVerified: true,
            isPremium: true,
          },
        },
      },
      take: query.limit ?? 20,
    });

    // 4. Format cards with approximate distance (never exact coordinates)
    const userLat = currentUser.profile.latitude;
    const userLon = currentUser.profile.longitude;

    return profiles
      .map((p) => {
        let distanceKm: number | null = null;
        if (userLat != null && userLon != null && p.latitude != null && p.longitude != null) {
          distanceKm = Math.round(this.calculateDistance(userLat, userLon, p.latitude, p.longitude));
        }

        return {
          id: p.id,
          userId: p.userId,
          displayName: p.displayName,
          age: this.calculateAge(p.birthDate),
          gender: p.gender,
          city: p.city,
          bio: p.bio,
          profession: p.profession,
          education: p.education,
          lookingFor: p.lookingFor,
          isVerified: p.user.isVerified,
          isPremium: p.user.isPremium,
          distanceKm,
          photos: p.photos.map((ph) => ({
            id: ph.id,
            url: ph.url,
            order: ph.order,
            isMain: ph.isMain,
          })),
          interests: p.interests.map((i) => i.interest.name),
        };
      })
      .filter((p) => {
        if (query.maxDistanceKm && p.distanceKm != null) {
          return p.distanceKm <= query.maxDistanceKm;
        }
        return true;
      });
  }

  async likeUser(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
      throw new BadRequestException('Vous ne pouvez pas vous aimer vous-même');
    }

    const [currentUser, targetUser] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: currentUserId },
        include: { profile: true },
      }),
      this.prisma.user.findUnique({
        where: { id: targetUserId },
        include: { profile: true },
      }),
    ]);

    if (!currentUser || !targetUser || targetUser.status !== UserStatus.ACTIVE) {
      throw new NotFoundException('Utilisateur cible introuvable');
    }

    // In MVP, likes are unlimited for all users
    // Upsert like
    await this.prisma.like.upsert({
      where: {
        fromUserId_toUserId: { fromUserId: currentUserId, toUserId: targetUserId },
      },
      create: { fromUserId: currentUserId, toUserId: targetUserId },
      update: {},
    });

    // Check if target user already liked current user (Mutual Match)
    const reciprocalLike = await this.prisma.like.findUnique({
      where: {
        fromUserId_toUserId: { fromUserId: targetUserId, toUserId: currentUserId },
      },
    });

    if (reciprocalLike) {
      // Create Match & Conversation
      const [u1, u2] = currentUserId < targetUserId
        ? [currentUserId, targetUserId]
        : [targetUserId, currentUserId];

      const match = await this.prisma.match.upsert({
        where: { user1Id_user2Id: { user1Id: u1, user2Id: u2 } },
        create: {
          user1Id: u1,
          user2Id: u2,
          isActive: true,
          conversation: { create: {} },
        },
        update: { isActive: true },
        include: { conversation: true },
      });

      // Send notifications to both users
      await this.prisma.notification.createMany({
        data: [
          {
            userId: currentUserId,
            title: 'Nouveau Match !',
            body: `Vous avez matché avec ${targetUser.profile?.displayName || 'un membre'} !`,
            type: 'MATCH',
            data: { matchId: match.id, otherUserId: targetUserId },
          },
          {
            userId: targetUserId,
            title: 'Nouveau Match !',
            body: `Vous avez matché avec ${currentUser.profile?.displayName || 'un membre'} !`,
            type: 'MATCH',
            data: { matchId: match.id, otherUserId: currentUserId },
          },
        ],
      });

      return {
        isMatch: true,
        matchId: match.id,
        conversationId: match.conversation?.id,
        matchedUser: {
          id: targetUser.id,
          displayName: targetUser.profile?.displayName,
          city: targetUser.profile?.city,
        },
      };
    }

    // If not mutual match yet, notify target user of like
    await this.prisma.notification.create({
      data: {
        userId: targetUserId,
        title: 'Nouveau Like !',
        body: 'Quelqu un a aimé votre profil sur Anonyme Pro.',
        type: 'LIKE',
      },
    });

    return {
      isMatch: false,
    };
  }

  async passUser(currentUserId: string, targetUserId: string) {
    if (currentUserId === targetUserId) {
      throw new BadRequestException('Action invalide');
    }

    await this.prisma.pass.upsert({
      where: {
        fromUserId_toUserId: { fromUserId: currentUserId, toUserId: targetUserId },
      },
      create: { fromUserId: currentUserId, toUserId: targetUserId },
      update: {},
    });

    return { success: true };
  }

  async rewindPass(currentUserId: string, targetUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: currentUserId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const pass = await this.prisma.pass.findUnique({
      where: {
        fromUserId_toUserId: { fromUserId: currentUserId, toUserId: targetUserId },
      },
    });

    if (!pass) {
      throw new NotFoundException('Aucun passage trouvé pour cet utilisateur');
    }

    await this.prisma.pass.delete({
      where: {
        fromUserId_toUserId: { fromUserId: currentUserId, toUserId: targetUserId },
      },
    });

    return { success: true, message: 'Passage annulé avec succès' };
  }

  async getMyMatches(currentUserId: string) {
    const matches = await this.prisma.match.findMany({
      where: {
        isActive: true,
        OR: [{ user1Id: currentUserId }, { user2Id: currentUserId }],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        conversation: {
          include: {
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
        user1: { include: { profile: { include: { photos: { where: { isMain: true } } } } } },
        user2: { include: { profile: { include: { photos: { where: { isMain: true } } } } } },
      },
    });

    return matches.map((m) => {
      const otherUser = m.user1Id === currentUserId ? m.user2 : m.user1;
      const lastMessage = m.conversation?.messages[0] || null;

      return {
        matchId: m.id,
        conversationId: m.conversation?.id,
        matchedAt: m.createdAt,
        otherUser: {
          id: otherUser.id,
          displayName: otherUser.profile?.displayName,
          age: otherUser.profile ? this.calculateAge(otherUser.profile.birthDate) : null,
          city: otherUser.profile?.city,
          photoUrl: otherUser.profile?.photos[0]?.url || null,
          isVerified: otherUser.isVerified,
          isPremium: otherUser.isPremium,
        },
        lastMessage: lastMessage
          ? {
              content: lastMessage.content,
              createdAt: lastMessage.createdAt,
              isRead: lastMessage.isRead,
              senderId: lastMessage.senderId,
            }
          : null,
      };
    });
  }

  async getLikesReceived(currentUserId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: currentUserId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const totalLikes = await this.prisma.like.count({
      where: { toUserId: currentUserId },
    });

    // In MVP: show full list of admirers to all users
    const likes = await this.prisma.like.findMany({
      where: { toUserId: currentUserId },
      orderBy: { createdAt: 'desc' },
      include: {
        fromUser: {
          include: {
            profile: {
              include: { photos: { where: { isMain: true } } },
            },
          },
        },
      },
    });

    return {
      totalLikes,
      isPremium: true,
      profiles: likes.map((l) => ({
        userId: l.fromUserId,
        displayName: l.fromUser.profile?.displayName,
        age: l.fromUser.profile ? this.calculateAge(l.fromUser.profile.birthDate) : null,
        city: l.fromUser.profile?.city,
        photoUrl: l.fromUser.profile?.photos[0]?.url || null,
        isVerified: l.fromUser.isVerified,
        likedAt: l.createdAt,
      })),
    };
  }

  async deleteMatch(currentUserId: string, matchId: string) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match || (match.user1Id !== currentUserId && match.user2Id !== currentUserId)) {
      throw new NotFoundException('Match introuvable');
    }

    await this.prisma.match.update({
      where: { id: matchId },
      data: { isActive: false },
    });

    return { success: true, message: 'Match supprimé avec succès' };
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Rayon moyen de la Terre en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  calculateAge(birthDate: Date): number {
    const today = new Date();
    const bdate = new Date(birthDate);
    let age = today.getFullYear() - bdate.getFullYear();
    const monthDiff = today.getMonth() - bdate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < bdate.getDate())) {
      age--;
    }
    return age;
  }
}
