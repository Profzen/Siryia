import { Injectable, Logger } from '@nestjs/common';
import { IKycVerifier, KycVerificationResult } from './kyc-verifier.interface';

@Injectable()
export class MockKycService implements IKycVerifier {
  private readonly logger = new Logger(MockKycService.name);

  async verifyIdentity(idCardUrl: string, selfieUrl: string): Promise<KycVerificationResult> {
    this.logger.log(`[MOCK] Vérification KYC initiée pour idCard=${idCardUrl} et selfie=${selfieUrl}`);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Simple mock logic: valid unless the URL contains the word 'fail'
    if (idCardUrl.includes('fail') || selfieUrl.includes('fail')) {
      this.logger.warn(`[MOCK] KYC Refusé`);
      return {
        isValid: false,
        score: 30,
        reason: 'Image trop floue ou visage non correspondant (MOCK)',
      };
    }

    this.logger.log(`[MOCK] KYC Validé avec succès`);
    return {
      isValid: true,
      score: 95,
    };
  }
}
