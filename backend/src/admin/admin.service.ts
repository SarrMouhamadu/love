import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActionReportDto, UpdateUserStatusDto } from './dto/admin.dto';
import { PaymentStatus, ReportStatus, UserRole, UserStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardAnalytics(adminId: string, ipAddress?: string) {
    // 1. User metrics
    const [
      totalUsers,
      activeUsers,
      verifiedUsers,
      premiumUsers,
      genderStats,
      cityStats,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
      this.prisma.user.count({ where: { isVerified: true } }),
      this.prisma.user.count({ where: { isPremium: true } }),
      this.prisma.profile.groupBy({
        by: ['gender'],
        _count: { userId: true },
      }),
      this.prisma.profile.groupBy({
        by: ['city'],
        _count: { userId: true },
        orderBy: { _count: { userId: 'desc' } },
        take: 5,
      }),
    ]);

    // 2. Engagement metrics
    const [totalLikes, totalMatches, totalMessages] = await Promise.all([
      this.prisma.like.count(),
      this.prisma.match.count(),
      this.prisma.message.count(),
    ]);

    // 3. Financial metrics
    const [paymentsPaid, paymentsFailed, activeSubscriptions] = await Promise.all([
      this.prisma.payment.findMany({
        where: { status: PaymentStatus.PAID },
        select: { amountXof: true },
      }),
      this.prisma.payment.count({ where: { status: PaymentStatus.FAILED } }),
      this.prisma.subscription.count({ where: { isActive: true } }),
    ]);

    const totalRevenueXof = paymentsPaid.reduce((acc, p) => acc + p.amountXof, 0);

    // 4. Security metrics
    const [pendingReports, pendingVerifications, suspendedUsers] = await Promise.all([
      this.prisma.report.count({ where: { status: ReportStatus.PENDING } }),
      this.prisma.verificationRequest.count({ where: { status: 'PENDING' } }),
      this.prisma.user.count({ where: { status: { in: [UserStatus.SUSPENDED, UserStatus.BLOCKED] } } }),
    ]);

    // Conversion rate
    const conversionRatePercentage = totalUsers > 0
      ? Number(((premiumUsers / totalUsers) * 100).toFixed(2))
      : 0;

    // Audit log
    await this.prisma.auditLog.create({
      data: {
        adminUserId: adminId,
        action: 'VIEW_DASHBOARD_METRICS',
        targetEntity: 'ANALYTICS',
        ipAddress,
        details: { timestamp: new Date().toISOString() },
      },
    });

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        verified: verifiedUsers,
        premium: premiumUsers,
        conversionRatePercentage,
        genderBreakdown: genderStats.map((g) => ({ gender: g.gender, count: g._count.userId })),
        topCities: cityStats.map((c) => ({ city: c.city, count: c._count.userId })),
      },
      engagement: {
        totalLikes,
        totalMatches,
        totalMessages,
      },
      financial: {
        totalRevenueXof,
        currency: 'XOF',
        successfulPaymentsCount: paymentsPaid.length,
        failedPaymentsCount: paymentsFailed,
        activeSubscriptionsCount: activeSubscriptions,
      },
      safety: {
        pendingReports,
        pendingVerifications,
        suspendedOrBlockedUsers: suspendedUsers,
      },
    };
  }

  async getUsersList(query: {
    search?: string;
    status?: UserStatus;
    role?: UserRole;
    page?: number;
    limit?: number;
  }) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.role) where.role = query.role;
    if (query.search) {
      where.OR = [
        { email: { contains: query.search, mode: 'insensitive' } },
        { profile: { displayName: { contains: query.search, mode: 'insensitive' } } },
        { profile: { city: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          isVerified: true,
          isPremium: true,
          createdAt: true,
          profile: {
            select: {
              displayName: true,
              gender: true,
              city: true,
              birthDate: true,
              photos: { where: { isMain: true } },
            },
          },
        },
      }),
    ]);

    return { total, page, limit, users };
  }

  async getUserDetails(adminId: string, targetUserId: string, ipAddress?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: targetUserId },
      include: {
        profile: {
          include: {
            photos: true,
            interests: { include: { interest: true } },
          },
        },
        verificationRequests: { include: { media: true }, orderBy: { createdAt: 'desc' } },
        reportsReceived: { include: { reporter: { select: { id: true, email: true } } } },
        subscriptions: { orderBy: { createdAt: 'desc' }, take: 5 },
        payments: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    // Trace sensitive user inspection in AuditLog
    await this.prisma.auditLog.create({
      data: {
        adminUserId: adminId,
        action: 'VIEW_USER_DETAILS',
        targetEntity: 'USER',
        targetId: targetUserId,
        ipAddress,
        details: { targetEmail: user.email },
      },
    });

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  async updateUserStatus(
    adminId: string,
    targetUserId: string,
    dto: UpdateUserStatusDto,
    ipAddress?: string,
  ) {
    const targetUser = await this.prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    if (targetUser.role === UserRole.SUPER_ADMIN) {
      throw new BadRequestException('Impossible de modifier le statut d un Super Administrateur');
    }

    const updated = await this.prisma.user.update({
      where: { id: targetUserId },
      data: { status: dto.status },
      select: { id: true, email: true, status: true },
    });

    await this.prisma.auditLog.create({
      data: {
        adminUserId: adminId,
        action: 'UPDATE_USER_STATUS',
        targetEntity: 'USER',
        targetId: targetUserId,
        ipAddress,
        details: {
          previousStatus: targetUser.status,
          newStatus: dto.status,
          reason: dto.reason,
        },
      },
    });

    return { success: true, user: updated };
  }

  async getReports(status?: ReportStatus, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};

    const [total, reports] = await Promise.all([
      this.prisma.report.count({ where }),
      this.prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          reporter: { select: { id: true, email: true } },
          reported: {
            select: {
              id: true,
              email: true,
              status: true,
              profile: { select: { displayName: true } },
            },
          },
        },
      }),
    ]);

    return { total, page, limit, reports };
  }

  async actionReport(
    adminId: string,
    reportId: string,
    dto: ActionReportDto,
    ipAddress?: string,
  ) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
      include: { reported: true },
    });

    if (!report) {
      throw new NotFoundException('Signalement introuvable');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.report.update({
        where: { id: reportId },
        data: {
          status: dto.status,
          actionNotes: dto.actionNotes,
          handledById: adminId,
        },
      });

      if (dto.banUser && report.reported) {
        await tx.user.update({
          where: { id: report.reportedId },
          data: { status: UserStatus.BLOCKED },
        });
      }

      await tx.auditLog.create({
        data: {
          adminUserId: adminId,
          action: 'ACTION_REPORT',
          targetEntity: 'REPORT',
          targetId: reportId,
          ipAddress,
          details: {
            decision: dto.status,
            notes: dto.actionNotes,
            bannedUser: !!dto.banUser,
            reportedUserId: report.reportedId,
          },
        },
      });
    });

    return { success: true, message: 'Signalement traité avec succès' };
  }

  async getAuditLogs(page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const [total, logs] = await Promise.all([
      this.prisma.auditLog.count(),
      this.prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          adminUser: {
            select: { id: true, email: true, role: true },
          },
        },
      }),
    ]);

    return { total, page, limit, logs };
  }
}
