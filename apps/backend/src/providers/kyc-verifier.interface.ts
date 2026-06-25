export interface KycVerificationResult {
  isValid: boolean;
  score: number; // e.g. 0 to 100
  reason?: string;
}

export interface IKycVerifier {
  verifyIdentity(idCardUrl: string, selfieUrl: string): Promise<KycVerificationResult>;
}
