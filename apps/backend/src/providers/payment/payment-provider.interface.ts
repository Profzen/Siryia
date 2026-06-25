export interface PaymentInitiationResult {
  success: boolean;
  transactionId: string;
  paymentUrl?: string; // S'il y a une page de redirection (ex: CinetPay)
  message?: string;
}

export interface PaymentVerificationResult {
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  amount: number;
  currency: string;
  externalTransactionId?: string;
}

export interface IPaymentProvider {
  /**
   * Identifiant unique du fournisseur (ex: 'TMONEY', 'MOOV', 'MOCK')
   */
  getProviderId(): string;

  /**
   * Initie un paiement auprès de l'opérateur.
   * @param amount Montant à facturer
   * @param currency Devise (ex: 'XOF')
   * @param reference Référence interne de la commande/paiement
   * @param customerPhone Numéro de téléphone (optionnel, pour mobile money push)
   */
  initiatePayment(
    amount: number,
    currency: string,
    reference: string,
    customerPhone?: string,
  ): Promise<PaymentInitiationResult>;

  /**
   * Vérifie le statut d'un paiement existant.
   * @param transactionId ID de la transaction chez l'opérateur ou référence locale
   */
  verifyPayment(transactionId: string): Promise<PaymentVerificationResult>;

  /**
   * Transfère les fonds depuis le compte Escrow vers le compte du vendeur.
   * @param amount Montant à transférer
   * @param destinationAccount Numéro de compte/téléphone du vendeur
   */
  processPayout(amount: number, destinationAccount: string): Promise<boolean>;
}
