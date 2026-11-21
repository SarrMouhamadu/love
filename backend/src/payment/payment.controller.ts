import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { NabooWebhookDto } from './dto/naboo-webhook.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('Paiements & Abonnements (NabooPay - Wave / Orange Money)')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('checkout/naboopay')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Créer une session de paiement NabooPay pour l abonnement Premium (500 FCFA)',
  })
  @ApiResponse({ status: 201, description: 'Lien de paiement retourné' })
  createCheckout(
    @CurrentUser('id') userId: string,
    @Body() dto: CreatePaymentDto,
  ) {
    return this.paymentService.createNabooPayCheckout(userId, dto);
  }

  @Post('webhook/naboopay')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Webhook de notification envoyé par NabooPay après paiement Wave/Orange Money',
  })
  handleWebhook(@Body() payload: NabooWebhookDto) {
    return this.paymentService.handleNabooWebhook(payload);
  }

  @Get('subscription')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Consulter l état de son abonnement Premium et l historique des paiements' })
  getSubscriptionStatus(@CurrentUser('id') userId: string) {
    return this.paymentService.getSubscriptionStatus(userId);
  }
}
