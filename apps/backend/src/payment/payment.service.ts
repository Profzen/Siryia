import { Injectable, Inject, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IPaymentProvider } from '../providers/payment/payment-provider.interface';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private prisma: PrismaService,
    @Inject('PAYMENT_PROVIDER') private paymentProvider: IPaymentProvider,
  ) {}

  async initiateEscrowPayment(userId: string, amount: number, providerName: string, orderId?: string, phone?: string) {
    this.logger.log(`Initiating ${providerName} payment of ${amount} for user ${userId}`);

    // 1. Appeler l'opérateur via l'interface
    const result = await this.paymentProvider.initiatePayment(amount, 'XOF', orderId || 'NO_ORDER', phone);
    
    if (!result.success) {
      throw new BadRequestException(result.message || 'Payment initiation failed');
    }

    // 2. Créer l'enregistrement de paiement (en statut PENDING par défaut)
    const payment = await this.prisma.payment.create({
      data: {
        orderId: orderId || null,
        amount,
        provider: providerName, // e.g. "TMONEY" ou "MOOV"
        status: 'PENDING',
        isEscrowed: true,       // Activer le séquestre par défaut
      }
    });

    // 3. Hack Mocking: le MockPaymentProvider renvoie SUCCESS instantanément lors du verify
    if (this.paymentProvider.getProviderId() === 'MOCK') {
      const verify = await this.paymentProvider.verifyPayment(result.transactionId);
      if (verify.status === 'SUCCESS') {
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'SUCCESS' }
        });
        
        // Mettre à jour la commande associée si elle existe
        if (orderId) {
          // On s'assure d'abord que la commande existe (sinon ça va planter en clé étrangère)
          const order = await this.prisma.order.findUnique({ where: { id: orderId }});
          if (order) {
            await this.prisma.order.update({
              where: { id: orderId },
              data: { status: 'CONFIRMED' }
            });
          }
        }
      }
    }

    return {
      paymentId: payment.id,
      transactionId: result.transactionId,
      url: result.paymentUrl,
      status: 'PENDING', // Ou 'SUCCESS' en mock local, mais le client lira PENDING pour poll
    };
  }

  async releaseEscrow(paymentId: string, userId: string) {
    this.logger.log(`User ${userId} requested Escrow release for payment ${paymentId}`);

    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true }
    });

    if (!payment) throw new NotFoundException('Paiement introuvable');
    if (!payment.isEscrowed) throw new BadRequestException('Ce paiement n\'est plus sous séquestre');
    if (payment.status !== 'SUCCESS') throw new BadRequestException('Le paiement n\'a pas encore été finalisé');
    
    // Si c'est lié à une commande, seul l'acheteur peut débloquer
    if (payment.order && payment.order.buyerId !== userId) {
      throw new BadRequestException('Seul l\'acheteur peut valider la réception et débloquer les fonds');
    }

    // Récupérer le compte de destination (Ex: le téléphone du vendeur). 
    // Pour cet exemple, on simule avec un numéro bidon.
    const sellerAccount = '+22890000000';

    // Appeler l'API de Payout du provider
    const payoutSuccess = await this.paymentProvider.processPayout(Number(payment.amount), sellerAccount);

    if (payoutSuccess) {
      await this.prisma.payment.update({
        where: { id: paymentId },
        data: {
          isEscrowed: false,
          escrowReleasedAt: new Date(),
        }
      });
      
      if (payment.orderId) {
        await this.prisma.order.update({
          where: { id: payment.orderId },
          data: { status: 'COMPLETED' }
        });
      }

      return { success: true, message: 'Fonds débloqués et transférés au vendeur avec succès' };
    }

    throw new BadRequestException('Échec du transfert Payout vers le vendeur');
  }
}
