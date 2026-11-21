import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { ActionReportDto, UpdateUserStatusDto } from './dto/admin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ReportStatus, UserRole, UserStatus } from '@prisma/client';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Administration & Modération (RBAC & Audit)')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('analytics')
  @Roles(UserRole.ANALYST, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Obtenir les métriques et indicateurs clés du tableau de bord (Analytics)' })
  getAnalytics(@CurrentUser('id') adminId: string, @Req() req: Request) {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    return this.adminService.getDashboardAnalytics(adminId, ip);
  }

  @Get('users')
  @Roles(UserRole.SUPPORT, UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Rechercher et filtrer les utilisateurs' })
  getUsers(
    @Query('search') search?: string,
    @Query('status') status?: UserStatus,
    @Query('role') role?: UserRole,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.adminService.getUsersList({
      search,
      status,
      role,
      page: pageNum,
      limit: limitNum,
    });
  }

  @Get('users/:id')
  @Roles(UserRole.SUPPORT, UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Consulter la fiche complète d un utilisateur (consigné dans l AuditLog)' })
  getUserDetails(
    @CurrentUser('id') adminId: string,
    @Param('id') targetUserId: string,
    @Req() req: Request,
  ) {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    return this.adminService.getUserDetails(adminId, targetUserId, ip);
  }

  @Put('users/:id/status')
  @Roles(UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Changer le statut d un utilisateur (Suspendre, Bloquer, Réactiver)' })
  updateUserStatus(
    @CurrentUser('id') adminId: string,
    @Param('id') targetUserId: string,
    @Body() dto: UpdateUserStatusDto,
    @Req() req: Request,
  ) {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    return this.adminService.updateUserStatus(adminId, targetUserId, dto, ip);
  }

  @Get('reports')
  @Roles(UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Lister les signalements d utilisateurs' })
  getReports(
    @Query('status') status?: ReportStatus,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.adminService.getReports(status, pageNum, limitNum);
  }

  @Post('reports/:id/action')
  @Roles(UserRole.MODERATOR, UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Traiter un signalement et appliquer une sanction' })
  actionReport(
    @CurrentUser('id') adminId: string,
    @Param('id') reportId: string,
    @Body() dto: ActionReportDto,
    @Req() req: Request,
  ) {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    return this.adminService.actionReport(adminId, reportId, dto, ip);
  }

  @Get('audit-logs')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Consulter le journal d audit de toutes les actions administratives' })
  getAuditLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 50;
    return this.adminService.getAuditLogs(pageNum, limitNum);
  }
}
