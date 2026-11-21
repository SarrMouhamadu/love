import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AddPhotoDto } from './dto/add-photo.dto';
import { UpdateInterestsDto } from './dto/update-interests.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyProfile(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        photos: { orderBy: { order: 'asc' } },
        interests: { include: { interest: true } },
        user: {
          select: {
            id: true,
            email: true,
            isVerified: true,
            isPremium: true,
            premiumExpiresAt: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Profil introuvable');
    }

    return {
      ...profile,
      age: this.calculateAge(profile.birthDate),
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user || !user.profile) {
      throw new NotFoundException('Profil introuvable');
    }

    // In MVP, incognito mode is accessible to all users
    const updated = await this.prisma.profile.update({
      where: { userId },
      data: {
        ...dto,
      },
      include: {
        photos: { orderBy: { order: 'asc' } },
        interests: { include: { interest: true } },
      },
    });

    return {
      ...updated,
      age: this.calculateAge(updated.birthDate),
    };
  }

  async getPublicProfile(targetUserId: string, requesterUserId?: string) {
    // Check if target is blocked by requester or vice versa
    if (requesterUserId) {
      const isBlocked = await this.prisma.block.findFirst({
        where: {
          OR: [
            { blockerId: requesterUserId, blockedId: targetUserId },
            { blockerId: targetUserId, blockedId: requesterUserId },
          ],
        },
      });

      if (isBlocked) {
        throw new NotFoundException('Profil inaccessible');
      }
    }

    const profile = await this.prisma.profile.findUnique({
      where: { userId: targetUserId },
      include: {
        photos: { orderBy: { order: 'asc' } },
        interests: { include: { interest: true } },
        user: {
          select: {
            id: true,
            isVerified: true,
            isPremium: true,
            status: true,
          },
        },
      },
    });

    if (!profile || profile.user.status !== 'ACTIVE') {
      throw new NotFoundException('Profil introuvable ou indisponible');
    }

    // Never return exact birthdate or internal search settings in public profiles
    return {
      id: profile.id,
      userId: profile.userId,
      displayName: profile.displayName,
      age: this.calculateAge(profile.birthDate),
      gender: profile.gender,
      city: profile.city,
      bio: profile.bio,
      profession: profile.profession,
      education: profile.education,
      lookingFor: profile.lookingFor,
      isVerified: profile.user.isVerified,
      isPremium: profile.user.isPremium,
      photos: profile.photos.map((p) => ({
        id: p.id,
        url: p.url,
        order: p.order,
        isMain: p.isMain,
      })),
      interests: profile.interests.map((i) => i.interest.name),
    };
  }

  async addPhoto(userId: string, dto: AddPhotoDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { photos: true },
    });

    if (!profile) {
      throw new NotFoundException('Profil introuvable');
    }

    if (profile.photos.length >= 6) {
      throw new BadRequestException('Vous ne pouvez pas ajouter plus de 6 photos');
    }

    const isFirstPhoto = profile.photos.length === 0;
    const shouldBeMain = isFirstPhoto || !!dto.isMain;

    if (shouldBeMain && !isFirstPhoto) {
      // Unmark existing main photos
      await this.prisma.profilePhoto.updateMany({
        where: { profileId: profile.id, isMain: true },
        data: { isMain: false },
      });
    }

    const newPhoto = await this.prisma.profilePhoto.create({
      data: {
        profileId: profile.id,
        url: dto.url,
        order: dto.order ?? profile.photos.length,
        isMain: shouldBeMain,
      },
    });

    return newPhoto;
  }

  async deletePhoto(userId: string, photoId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { photos: true },
    });

    if (!profile) {
      throw new NotFoundException('Profil introuvable');
    }

    const photoToDelete = profile.photos.find((p) => p.id === photoId);
    if (!photoToDelete) {
      throw new NotFoundException('Photo introuvable');
    }

    await this.prisma.profilePhoto.delete({
      where: { id: photoId },
    });

    // If deleted photo was main, reassign main to the first available photo
    if (photoToDelete.isMain) {
      const remainingPhotos = await this.prisma.profilePhoto.findMany({
        where: { profileId: profile.id },
        orderBy: { order: 'asc' },
      });

      if (remainingPhotos.length > 0) {
        await this.prisma.profilePhoto.update({
          where: { id: remainingPhotos[0].id },
          data: { isMain: true },
        });
      }
    }

    return { success: true, message: 'Photo supprimée avec succès' };
  }

  async setMainPhoto(userId: string, photoId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: { photos: true },
    });

    if (!profile) {
      throw new NotFoundException('Profil introuvable');
    }

    const photo = profile.photos.find((p) => p.id === photoId);
    if (!photo) {
      throw new NotFoundException('Photo introuvable');
    }

    await this.prisma.$transaction([
      this.prisma.profilePhoto.updateMany({
        where: { profileId: profile.id },
        data: { isMain: false },
      }),
      this.prisma.profilePhoto.update({
        where: { id: photoId },
        data: { isMain: true },
      }),
    ]);

    return { success: true, message: 'Photo principale mise à jour' };
  }

  async updateInterests(userId: string, dto: UpdateInterestsDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Profil introuvable');
    }

    // Limit to 10 interests
    const cleanNames = Array.from(
      new Set(dto.interestNames.map((n) => n.trim()).filter((n) => n.length > 0)),
    ).slice(0, 10);

    // Upsert interests
    const interestRecords = await Promise.all(
      cleanNames.map((name) =>
        this.prisma.interest.upsert({
          where: { name },
          create: { name },
          update: {},
        }),
      ),
    );

    // Replace user interests
    await this.prisma.$transaction([
      this.prisma.userInterest.deleteMany({
        where: { profileId: profile.id },
      }),
      this.prisma.userInterest.createMany({
        data: interestRecords.map((i) => ({
          profileId: profile.id,
          interestId: i.id,
        })),
      }),
    ]);

    return this.getMyProfile(userId);
  }

  async getAllInterests() {
    return this.prisma.interest.findMany({
      orderBy: { name: 'asc' },
    });
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
