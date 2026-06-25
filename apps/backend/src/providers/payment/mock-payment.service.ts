import { Injectable, Logger } from '@nestjs/common';
import { IPaymentProvider, PaymentInitiationResult, PaymentVerificationResult } from './payment-provider.interface';

@Injectable()
export class MockPaymentService implements IPaymentProvider {
  private readonly logger = new Logger(MockPaymentService.name);
  
  // Base de données en mémoire pour simuler les statuts
  private transactions = new Map<string, any>();

  getProviderId(): string {
    return 'MOCK';
  }

  async initiatePayment(
    amount: number,
    currency: string,
    reference: string,
    customerPhone?: string,
  ): Promise<PaymentInitiationResult> {
    this.logger.log(`[MOCK] Initating payment of ${amount} ${currency} for ref ${reference} to phone ${customerPhone || 'N/A'}`);
    
    // Simuler un délai réseau
    await new Promise((resolve) => setTimeout(resolve, 500));

    const transactionId = `MOCK_TX_${Date.now()}`;
    
    this.transactions.set(transactionId, {
      amount,
      currency,
      status: 'SUCCESS', // On le passe en SUCCESS tout de suite pour faciliter nos tests sans webhook externe
      reference
    });

    return {
      success: true,
      transactionId,
      message: 'Paiement simulé avec succès.',
      paymentUrl: `http://localhost:3000/payment/mock?tx=${transactionId}`,
    };
  }

  async verifyPayment(transactionId: string): Promise<PaymentVerificationResult> {
    this.logger.log(`[MOCK] Verifying payment ${transactionId}`);
    
    const tx = this.transactions.get(transactionId);
    if (!tx) {
      return { status: 'FAILED', amount: 0, currency: 'XOF' };
    }

    return {
      status: tx.status,
      amount: tx.amount,
      currency: tx.currency,
      externalTransactionId: transactionId
    };
  }

  async processPayout(amount: number, destinationAccount: string): Promise<boolean> {
    this.logger.log(`[MOCK] Processing payout of ${amount} to ${destinationAccount} (Escrow Release)`);
    await new Promise((resolve) => setTimeout(resolve, 300));
    return true; // Payout toujours réussi en mock
  }
}
