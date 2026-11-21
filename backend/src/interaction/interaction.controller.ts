import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { DiscoveryQueryDto } from './dto/discovery-query.dto';
import { LikeDto, PassDto, RewindDto } from './dto/interaction-actions.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Découverte & Interactions')
@Controller('interaction')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  @Get('discover')
  @ApiOperation({ summary: 'Découvrir des profils compatibles selon mes filtres' })
  discover(
    @CurrentUser('id') userId: string,
    @Query() query: DiscoveryQueryDto,
  ) {
    return this.interactionService.getDiscoveryProfiles(userId, query);
  }

  @Post('like')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Aimer un profil (gestion des limites gratuites et détection de match)' })
  @ApiResponse({ status: 200, description: 'Like enregistré ou Match créé' })
  like(@CurrentUser('id') userId: string, @Body() dto: LikeDto) {
    return this.interactionService.likeUser(userId, dto.targetUserId);
  }

  @Post('pass')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Passer un profil' })
  pass(@CurrentUser('id') userId: string, @Body() dto: PassDto) {
    return this.interactionService.passUser(userId, dto.targetUserId);
  }

  @Post('rewind')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '[Premium] Annuler le dernier passage d un profil (Rewind)' })
  rewind(@CurrentUser('id') userId: string, @Body() dto: RewindDto) {
    return this.interactionService.rewindPass(userId, dto.targetUserId);
  }

  @Get('matches')
  @ApiOperation({ summary: 'Obtenir la liste de mes matchs actifs avec le dernier message' })
  getMatches(@CurrentUser('id') userId: string) {
    return this.interactionService.getMyMatches(userId);
  }

  @Get('likes-received')
  @ApiOperation({ summary: 'Consulter qui a aimé mon profil (déflouté pour Premium, masqué pour Gratuit)' })
  getLikesReceived(@CurrentUser('id') userId: string) {
    return this.interactionService.getLikesReceived(userId);
  }

  @Delete('matches/:id')
  @ApiOperation({ summary: 'Supprimer un match (Unmatch)' })
  deleteMatch(
    @CurrentUser('id') userId: string,
    @Param('id') matchId: string,
  ) {
    return this.interactionService.deleteMatch(userId, matchId);
  }
}
