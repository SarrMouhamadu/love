import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AddPhotoDto } from './dto/add-photo.dto';
import { UpdateInterestsDto } from './dto/update-interests.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Profils')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Consulter mon profil complet' })
  async getMyProfile(@CurrentUser('id') userId: string) {
    return this.profileService.getMyProfile(userId);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour mon profil' })
  async updateMyProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(userId, dto);
  }

  @Get('interests/all')
  @ApiOperation({ summary: 'Obtenir la liste de tous les centres d intérêt' })
  async getAllInterests() {
    return this.profileService.getAllInterests();
  }

  @Put('interests')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour mes centres d intérêt' })
  async updateInterests(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateInterestsDto,
  ) {
    return this.profileService.updateInterests(userId, dto);
  }

  @Post('photos')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ajouter une photo de profil (max 6 photos)' })
  @ApiResponse({ status: 201, description: 'Photo ajoutée avec succès' })
  async addPhoto(@CurrentUser('id') userId: string, @Body() dto: AddPhotoDto) {
    return this.profileService.addPhoto(userId, dto);
  }

  @Delete('photos/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Supprimer une photo de profil' })
  async deletePhoto(
    @CurrentUser('id') userId: string,
    @Param('id') photoId: string,
  ) {
    return this.profileService.deletePhoto(userId, photoId);
  }

  @Put('photos/:id/main')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Définir une photo comme photo principale' })
  async setMainPhoto(
    @CurrentUser('id') userId: string,
    @Param('id') photoId: string,
  ) {
    return this.profileService.setMainPhoto(userId, photoId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Consulter le profil public d un autre utilisateur' })
  async getPublicProfile(
    @Param('id') targetUserId: string,
    @CurrentUser('id') requesterId: string,
  ) {
    return this.profileService.getPublicProfile(targetUserId, requesterId);
  }
}
