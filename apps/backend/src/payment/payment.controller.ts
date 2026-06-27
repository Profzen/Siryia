import { Controller, Post, Body, Param, UseGuards, Req, Logger } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  /**
   * Initie un paiement avec Escrow (Séquestre)
   */
  @UseGuards(JwtAuthGuard)
  @Post('initiate')
  async initiatePayment(
    @Req() req: any,
    @Body() body: { amount: number; provider: string; orderId?: string; phone?: string }
  ) {
    const userId = req.user.id;
    return this.paymentService.initiateEscrowPayment(
      userId,
      body.amount,
      body.provider || 'MOCK',
      body.orderId,
      body.phone
    );
  }

  /**
   * Webhook public appelé par les opérateurs (TMoney, Moov, CinetPay)
   * Protégé idéalement par une vérification de signature (ex: HMAC)
   */
  @Post('webhook/:provider')
  async handleWebhook(@Param('provider') provider: string, @Body() payload: any) {
    this.logger.log(`Received webhook from ${provider}:`, payload);
    
    // TODO (Future):
    // 1. Vérifier la signature du payload avec la clé secrète de l'opérateur
    // 2. Extraire le transactionId
    // 3. Mettre à jour la base de données (Prisma)
    // this.paymentService.updatePaymentStatus(payload.tx_ref, 'SUCCESS');
    
    return { received: true };
  }

  /**
   * Débloque l'Escrow (transfert les fonds au vendeur)
   * Doit être appelé par l'acheteur quand il confirme la bonne réception
   */
  @UseGuards(JwtAuthGuard)
  @Post(':id/release')
  async releaseEscrow(@Param('id') paymentId: string, @Req() req: any) {
    const userId = req.user.id;
    return this.paymentService.releaseEscrow(paymentId, userId);
  }
}
