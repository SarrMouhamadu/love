import {
  Injectable,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as fs from 'fs';
import * as path from 'path';
import { PresignedUrlDto } from './dto/storage.dto';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private s3Client: S3Client | null = null;
  private bucket: string;
  private isS3Configured = false;
  private readonly localUploadDir = path.resolve(process.cwd(), 'uploads');

  constructor(private readonly configService: ConfigService) {
    const accessKeyId = this.configService.get<string>('STORAGE_ACCESS_KEY');
    const secretAccessKey = this.configService.get<string>('STORAGE_SECRET_KEY');
    const endpoint = this.configService.get<string>('STORAGE_ENDPOINT');
    const region = this.configService.get<string>('STORAGE_REGION', 'us-east-1');
    this.bucket = this.configService.get<string>('STORAGE_BUCKET', 'anonymepro-media');

    if (accessKeyId && secretAccessKey) {
      this.s3Client = new S3Client({
        region,
        endpoint: endpoint || undefined,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
        forcePathStyle: !!endpoint, // required for MinIO / custom S3 endpoints
      });
      this.isS3Configured = true;
      this.logger.log(`Stockage S3 / R2 initialisé sur le bucket: ${this.bucket}`);
    } else {
      this.logger.warn(
        'Identifiants S3 non détectés. Utilisation du stockage local sur disque (/uploads).',
      );
      this.ensureLocalDirExists();
    }
  }

  private ensureLocalDirExists() {
    if (!fs.existsSync(this.localUploadDir)) {
      fs.mkdirSync(this.localUploadDir, { recursive: true });
    }
  }

  async getPresignedUploadUrl(userId: string, dto: PresignedUrlDto) {
    const cleanFileName = dto.fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `${dto.folder}/${userId}/${Date.now()}-${cleanFileName}`;

    if (this.isS3Configured && this.s3Client) {
      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        ContentType: dto.fileType,
      });

      const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 900 }); // 15 mins
      const fileUrl = this.getPublicOrDirectUrl(key);

      return {
        mode: 's3',
        key,
        uploadUrl,
        fileUrl,
        expiresInSeconds: 900,
      };
    }

    // Local development fallback
    const port = this.configService.get<number>('PORT', 3001);
    const host = process.env.BASE_URL || `http://localhost:${port}`;
    return {
      mode: 'local',
      key,
      uploadUrl: `${host}/api/v1/storage/upload`,
      fileUrl: `${host}/api/v1/storage/files/${key}`,
      expiresInSeconds: 3600,
    };
  }

  async getPresignedReadUrl(key: string, expiresInSeconds = 3600): Promise<string> {
    if (this.isS3Configured && this.s3Client) {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      return getSignedUrl(this.s3Client, command, { expiresIn: expiresInSeconds });
    }

    // Local fallback
    const port = this.configService.get<number>('PORT', 3001);
    const host = process.env.BASE_URL || `http://localhost:${port}`;
    return `${host}/api/v1/storage/files/${key}`;
  }

  async saveLocalFile(
    file: Express.Multer.File,
    folder: 'profiles' | 'verification' | 'chat',
    userId: string,
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    const folderPath = path.join(this.localUploadDir, folder, userId);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const safeName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(folderPath, safeName);
    fs.writeFileSync(filePath, file.buffer);

    const relativeKey = `${folder}/${userId}/${safeName}`;
    const port = this.configService.get<number>('PORT', 3001);
    const host = process.env.BASE_URL || `http://localhost:${port}`;

    return {
      key: relativeKey,
      fileUrl: `${host}/api/v1/storage/files/${relativeKey}`,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  getLocalFilePath(key: string): string {
    const safePath = path.normalize(key).replace(/^(\.\.[\/\\])+/, '');
    const fullPath = path.join(this.localUploadDir, safePath);

    if (!fs.existsSync(fullPath)) {
      throw new BadRequestException('Fichier introuvable');
    }

    return fullPath;
  }

  private getPublicOrDirectUrl(key: string): string {
    const endpoint = this.configService.get<string>('STORAGE_ENDPOINT');
    if (endpoint) {
      return `${endpoint}/${this.bucket}/${key}`;
    }
    const region = this.configService.get<string>('STORAGE_REGION', 'us-east-1');
    return `https://${this.bucket}.s3.${region}.amazonaws.com/${key}`;
  }
}
