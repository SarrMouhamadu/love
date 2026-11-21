import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh.dto';
import { JwtPayload } from './strategies/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    // 1. Check if user already exists
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('Un compte existe déjà avec cette adresse email');
    }

    // 2. Validate age (18+ requirement)
    const birthDate = new Date(dto.birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      throw new BadRequestException('Vous devez avoir au moins 18 ans pour vous inscrire');
    }

    // 3. Hash password
    const passwordHash = await bcrypt.hash(dto.password, 12);

    // 4. Create user and profile in a transaction (All features fully accessible in MVP)
    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        isPremium: true,
        profile: {
          create: {
            displayName: dto.displayName.trim(),
            birthDate,
            gender: dto.gender,
            city: dto.city || 'Dakar',
          },
        },
        notificationPref: {
          create: {
            newLikes: true,
            newMatches: true,
            newMessages: true,
          },
        },
        marketingConsent: {
          create: {
            consentGiven: !!dto.marketingConsent,
            consentedAt: dto.marketingConsent ? new Date() : null,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // 5. Generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(dto: LoginDto, deviceInfo?: string, ipAddress?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: { profile: { include: { photos: true } } },
    });

    if (!user) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    if (user.status === 'BLOCKED' || user.status === 'DELETED') {
      throw new UnauthorizedException('Votre compte est suspendu ou supprimé');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Identifiants incorrects');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // Record session
    await this.prisma.userSession.create({
      data: {
        userId: user.id,
        tokenHash: await bcrypt.hash(tokens.refreshToken, 8),
        deviceInfo,
        ipAddress,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async refreshTokens(dto: RefreshTokenDto) {
    try {
      const refreshSecret = this.configService.get<string>(
        'JWT_REFRESH_SECRET',
        'supersecret_refresh_jwt_key_change_in_production',
      );
      const payload = this.jwtService.verify<JwtPayload>(dto.refreshToken, {
        secret: refreshSecret,
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || user.status === 'BLOCKED' || user.status === 'DELETED') {
        throw new UnauthorizedException('Session invalide');
      }

      return this.generateTokens(user.id, user.email, user.role);
    } catch {
      throw new UnauthorizedException('Refresh token invalide ou expiré');
    }
  }

  async logout(userId: string) {
    // Revoke active sessions for user
    await this.prisma.userSession.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    return { success: true, message: 'Déconnexion réussie' };
  }

  private async generateTokens(userId: string, email: string, role: string) {
    const payload: JwtPayload = { sub: userId, email, role };

    const accessTokenExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '7d');
    const refreshTokenExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '30d');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET', 'supersecret_jwt_key_change_in_production_anonymepro'),
        expiresIn: accessTokenExpiresIn as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>(
          'JWT_REFRESH_SECRET',
          'supersecret_refresh_jwt_key_change_in_production',
        ),
        expiresIn: refreshTokenExpiresIn as any,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  sanitizeUser(user: any) {
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
