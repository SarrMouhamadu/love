import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { NabooWebhookDto } from './dto/naboo-webhook.dto';
import { PaymentProvider, PaymentStatus, SubscriptionTier } from '@prisma/client';

const PREMIUM_PRICE_XOF = 500;
const SUBSCRIPTION_DAYS = 30;

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async createNabooPayCheckout(userId: string, dto: CreatePaymentDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const apiKey = this.configService.get<string>('NABOOPAY_API_KEY');
    const baseUrl = this.configService.get<string>(
      'NABOOPAY_BASE_URL',
      'https://api.naboopay.com',
    );
    const frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:5173',
    );

    const methods = dto.paymentMethods && dto.paymentMethods.length > 0
      ? dto.paymentMethods
      : ['wave', 'orange_money'];

    // In development or if API key is not yet set, generate a working local checkout simulation
    if (!apiKey) {
      this.logger.warn(
        'NABOOPAY_API_KEY non configurée. Génération d une session de paiement simulée pour l environnement de développement.',
      );
      const simulatedOrderId = `nb_sim_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      await this.prisma.payment.create({
        data: {
          userId,
          provider: PaymentProvider.NABOOPAY,
          externalTxId: simulatedOrderId,
          amountXof: PREMIUM_PRICE_XOF,
          status: PaymentStatus.PENDING,
          metadata: {
            simulation: true,
            methods,
            phone: dto.phoneNumber,
          },
        },
      });

      return {
        orderId: simulatedOrderId,
        checkoutUrl: `${frontendUrl}/payment/checkout?orderId=${simulatedOrderId}&simulated=true`,
        amountXof: PREMIUM_PRICE_XOF,
        provider: 'NabooPay (Wave / Orange Money)',
      };
    }

    // Call live NabooPay API v2
    const payload = {
      total_amount: PREMIUM_PRICE_XOF,
      payment_methods: methods,
      success_url: `${frontendUrl}/payment/success`,
      error_url: `${frontendUrl}/payment/error`,
      products: [
        {
          name: 'Abonnement Anonyme Pro Premium (1 mois)',
          price: PREMIUM_PRICE_XOF,
          quantity: 1,
        },
      ],
      customer: {
        first_name: user.profile?.displayName || 'Membre',
        last_name: 'AnonymePro',
        email: user.email,
        phone_number: dto.phoneNumber || undefined,
      },
    };

    try {
      const response = await fetch(`${baseUrl}/api/v2/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Erreur NabooPay API (${response.status}): ${errorText}`);
        throw new BadRequestException('Échec de création de la session de paiement NabooPay');
      }

      const data = (await response.json()) as {
        order_id: string;
        checkout_url: string;
        status?: string;
      };

      await this.prisma.payment.create({
        data: {
          userId,
          provider: PaymentProvider.NABOOPAY,
          externalTxId: data.order_id,
          amountXof: PREMIUM_PRICE_XOF,
          status: PaymentStatus.PENDING,
          metadata: {
            methods,
            phone: dto.phoneNumber,
          },
        },
      });

      return {
        orderId: data.order_id,
        checkoutUrl: data.checkout_url,
        amountXof: PREMIUM_PRICE_XOF,
        provider: 'NabooPay (Wave / Orange Money)',
      };
    } catch (err: any) {
      if (err instanceof BadRequestException) throw err;
      this.logger.error('Erreur réseau NabooPay:', err);
      throw new BadRequestException('Impossible de joindre la passerelle de paiement NabooPay');
    }
  }

  async handleNabooWebhook(payload: NabooWebhookDto) {
    const { order_id } = payload;
    const rawStatus = (payload.transaction_status || payload.status || '').toLowerCase();

    this.logger.log(`Webhook NabooPay reçu pour la commande ${order_id} - statut: ${rawStatus}`);

    const payment = await this.prisma.payment.findUnique({
      where: { externalTxId: order_id },
      include: { user: true },
    });

    if (!payment) {
      this.logger.warn(`Paiement introuvable pour order_id: ${order_id}`);
      return { received: true, ignored: true };
    }

    // If already processed as paid, don't reprocess
    if (payment.status === PaymentStatus.PAID) {
      return { received: true, message: 'Paiement déjà validé' };
    }

    const isSuccess = ['paid', 'completed', 'success', 'done'].includes(rawStatus);
    const isFailed = ['failed', 'canceled', 'cancelled', 'expired'].includes(rawStatus);

    if (isSuccess) {
      const now = new Date();
      // Calculate new expiration date
      let newExpiresAt: Date;
      if (payment.user.isPremium && payment.user.premiumExpiresAt && payment.user.premiumExpiresAt > now) {
        newExpiresAt = new Date(payment.user.premiumExpiresAt.getTime() + SUBSCRIPTION_DAYS * 24 * 60 * 60 * 1000);
      } else {
        newExpiresAt = new Date(now.getTime() + SUBSCRIPTION_DAYS * 24 * 60 * 60 * 1000);
      }

      await this.prisma.$transaction([
        this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: PaymentStatus.PAID,
            metadata: {
              ...((payment.metadata as object) || {}),
              webhookPayload: JSON.parse(JSON.stringify(payload)),
              processedAt: now.toISOString(),
            },
          },
        }),
        this.prisma.user.update({
          where: { id: payment.userId },
          data: {
            isPremium: true,
            premiumExpiresAt: newExpiresAt,
          },
        }),
        this.prisma.subscription.create({
          data: {
            userId: payment.userId,
            tier: SubscriptionTier.PREMIUM,
            priceXof: payment.amountXof,
            startDate: now,
            endDate: newExpiresAt,
            isActive: true,
          },
        }),
        this.prisma.notification.create({
          data: {
            userId: payment.userId,
            title: 'Abonnement Premium activé !',
            body: `Votre paiement de ${payment.amountXof} FCFA via Wave/Orange Money a été confirmé. Vous profitez d Anonyme Pro Premium pour 30 jours !`,
            type: 'PAYMENT',
          },
        }),
      ]);

      return { received: true, status: 'ACTIVATED' };
    }

    if (isFailed) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.FAILED },
      });
      return { received: true, status: 'FAILED' };
    }

    return { received: true, status: 'PENDING' };
  }

  async getSubscriptionStatus(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        isPremium: true,
        premiumExpiresAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    const [activeSubscription, recentPayments] = await Promise.all([
      this.prisma.subscription.findFirst({
        where: { userId, isActive: true },
        orderBy: { endDate: 'desc' },
      }),
      this.prisma.payment.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    const isCurrentlyActive = !!(
      user.isPremium &&
      user.premiumExpiresAt &&
      user.premiumExpiresAt > new Date()
    );

    return {
      isPremium: isCurrentlyActive,
      premiumExpiresAt: user.premiumExpiresAt,
      tier: isCurrentlyActive ? 'PREMIUM' : 'FREE',
      priceMonthlyXof: PREMIUM_PRICE_XOF,
      activeSubscription,
      payments: recentPayments.map((p) => ({
        id: p.id,
        provider: p.provider,
        externalTxId: p.externalTxId,
        amountXof: p.amountXof,
        status: p.status,
        createdAt: p.createdAt,
      })),
    };
  }

  computeNewExpiry(currentExpiry: Date | null, daysToAdd: number = SUBSCRIPTION_DAYS): Date {
    const now = new Date();
    const baseDate = currentExpiry && currentExpiry > now ? currentExpiry : now;
    return new Date(baseDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  }
}
