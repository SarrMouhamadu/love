import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmitVerificationDto } from './dto/submit-verification.dto';
import { ReviewVerificationDto } from './dto/review-verification.dto';
import { MediaType, VerificationStatus } from '@prisma/client';

const SELFIE_INSTRUCTIONS = [
  'Tournez la tête vers la droite',
  'Tournez la tête vers la gauche',
  'Regardez vers le haut avec un sourire',
  'Faites un signe de la main face caméra',
  'Touchez votre oreille gauche avec votre main droite',
  'Placez un doigt sur votre menton',
  'Faites le signe de la victoire (V) de la main',
];

@Injectable()
export class VerificationService {
  constructor(private readonly prisma: PrismaService) {}

  generateInstructions() {
    // Pick 2 distinct selfie challenges
    const shuffled = [...SELFIE_INSTRUCTIONS].sort(() => 0.5 - Math.random());
    const instruction1 = shuffled[0];
    const instruction2 = shuffled[1];

    // Generate random 4-digit verification code for speech
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const voicePhrase = `Bonjour, je certifie être le titulaire de ce compte Anonyme Pro avec le code de sécurité ${randomCode}.`;

    return {
      selfie1Instruction: instruction1,
      selfie2Instruction: instruction2,
      voicePhrase,
      voiceDurationSeconds: 20,
    };
  }

  async submitVerification(userId: string, dto: SubmitVerificationDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { verificationRequests: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    if (user.isVerified) {
      throw new BadRequestException('Votre profil est déjà vérifié');
    }

    const latest = user.verificationRequests[0];
    if (latest && latest.status === VerificationStatus.PENDING) {
      throw new BadRequestException('Une demande de vérification est déjà en cours de traitement');
    }

    // Create verification request and media records in a transaction
    const request = await this.prisma.verificationRequest.create({
      data: {
        userId,
        status: VerificationStatus.PENDING,
        media: {
          create: [
            {
              type: MediaType.SELFIE_INSTRUCTION_1,
              fileUrl: dto.selfie1Url,
              instructionText: dto.selfie1Instruction,
            },
            {
              type: MediaType.SELFIE_INSTRUCTION_2,
              fileUrl: dto.selfie2Url,
              instructionText: dto.selfie2Instruction,
            },
            {
              type: MediaType.VOICE_RECORDING,
              fileUrl: dto.audioUrl,
              instructionText: dto.audioPhrase,
            },
          ],
        },
      },
      include: {
        media: true,
      },
    });

    return {
      success: true,
      message: 'Demande de vérification soumise avec succès',
      requestId: request.id,
      status: request.status,
    };
  }

  async getMyStatus(userId: string) {
    const latest = await this.prisma.verificationRequest.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { media: true },
    });

    if (!latest) {
      return {
        status: VerificationStatus.NONE,
        message: 'Aucune demande de vérification soumise',
      };
    }

    return {
      id: latest.id,
      status: latest.status,
      rejectionReason: latest.rejectionReason,
      createdAt: latest.createdAt,
      reviewedAt: latest.reviewedAt,
      mediaCount: latest.media.length,
    };
  }

  async getPendingRequests(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [total, requests] = await Promise.all([
      this.prisma.verificationRequest.count({
        where: { status: VerificationStatus.PENDING },
      }),
      this.prisma.verificationRequest.findMany({
        where: { status: VerificationStatus.PENDING },
        skip,
        take: limit,
        orderBy: { createdAt: 'asc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  displayName: true,
                  gender: true,
                  birthDate: true,
                  photos: { where: { isMain: true } },
                },
              },
            },
          },
          media: true,
        },
      }),
    ]);

    return {
      total,
      page,
      limit,
      requests,
    };
  }

  async reviewRequest(
    requestId: string,
    adminId: string,
    dto: ReviewVerificationDto,
    ipAddress?: string,
  ) {
    const request = await this.prisma.verificationRequest.findUnique({
      where: { id: requestId },
      include: { user: true },
    });

    if (!request) {
      throw new NotFoundException('Demande de vérification introuvable');
    }

    if (request.status !== VerificationStatus.PENDING) {
      throw new BadRequestException('Cette demande a déjà été traitée');
    }

    const isApproved = dto.status === VerificationStatus.VERIFIED;

    // Transaction to update request, user status, and create audit log
    await this.prisma.$transaction([
      this.prisma.verificationRequest.update({
        where: { id: requestId },
        data: {
          status: dto.status,
          rejectionReason: dto.rejectionReason || null,
          reviewedById: adminId,
          reviewedAt: new Date(),
        },
      }),
      this.prisma.user.update({
        where: { id: request.userId },
        data: {
          isVerified: isApproved,
        },
      }),
      this.prisma.auditLog.create({
        data: {
          adminUserId: adminId,
          action: isApproved ? 'APPROVE_VERIFICATION' : 'REJECT_VERIFICATION',
          targetEntity: 'VERIFICATION_REQUEST',
          targetId: requestId,
          ipAddress,
          details: {
            decision: dto.status,
            reason: dto.rejectionReason,
            targetUserId: request.userId,
          },
        },
      }),
    ]);

    return {
      success: true,
      message: isApproved
        ? 'Profil utilisateur vérifié avec succès'
        : 'Demande de vérification rejetée',
      status: dto.status,
    };
  }
}
