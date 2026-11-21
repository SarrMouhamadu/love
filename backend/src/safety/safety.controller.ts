import {
  Controller,
  Post,
  Delete,
  Get,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SafetyService } from './safety.service';
import { BlockUserDto, ReportUserDto } from './dto/safety.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Sécurité & Modération Utilisateurs')
@Controller('safety')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SafetyController {
  constructor(private readonly safetyService: SafetyService) {}

  @Post('block')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Bloquer un utilisateur' })
  blockUser(@CurrentUser('id') userId: string, @Body() dto: BlockUserDto) {
    return this.safetyService.blockUser(userId, dto.blockedUserId);
  }

  @Delete('block/:id')
  @ApiOperation({ summary: 'Débloquer un utilisateur' })
  unblockUser(@CurrentUser('id') userId: string, @Param('id') targetId: string) {
    return this.safetyService.unblockUser(userId, targetId);
  }

  @Get('blocked')
  @ApiOperation({ summary: 'Liste de mes utilisateurs bloqués' })
  getBlockedUsers(@CurrentUser('id') userId: string) {
    return this.safetyService.getBlockedUsers(userId);
  }

  @Post('report')
  @ApiOperation({ summary: 'Signaler un utilisateur pour comportement abusif' })
  @ApiResponse({ status: 201, description: 'Signalement enregistré' })
  reportUser(@CurrentUser('id') userId: string, @Body() dto: ReportUserDto) {
    return this.safetyService.reportUser(userId, dto);
  }
}
