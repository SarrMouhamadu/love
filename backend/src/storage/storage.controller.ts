import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { PresignedUrlDto } from './dto/storage.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Stockage des Médias (S3 / R2 & Local)')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('presigned-url')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtenir une URL pré-signée pour uploader directement un média (S3/R2)',
  })
  getPresignedUrl(
    @CurrentUser('id') userId: string,
    @Body() dto: PresignedUrlDto,
  ) {
    return this.storageService.getPresignedUploadUrl(userId, dto);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload direct de fichier (photos, notes vocales)' })
  uploadFile(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder: 'profiles' | 'verification' | 'chat' = 'profiles',
  ) {
    return this.storageService.saveLocalFile(file, folder, userId);
  }

  @Get('files/*')
  @ApiOperation({ summary: 'Accéder à un fichier localement stocké' })
  serveFile(@Param('0') key: string, @Res() res: Response) {
    const filePath = this.storageService.getLocalFilePath(key);
    return res.sendFile(filePath);
  }
}
