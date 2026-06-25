import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../providers/storage.service';
import { MockKycService } from '../providers/mock-kyc.service';

@Injectable()
export class KycService {
  private readonly logger = new Logger(KycService.name);
  private readonly BUCKET_NAME = 'kyc-documents';

  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
    private kycVerifier: MockKycService,
  ) {}

  async uploadDocument(userId: string, documentType: string, file: Express.Multer.File) {
    if (!['ID_CARD', 'PASSPORT', 'SELFIE', 'RCCM'].includes(documentType)) {
      throw new BadRequestException('Type de document invalide');
    }

    // Path in bucket: userId/timestamp-filename
    const path = `${userId}/${Date.now()}-${file.originalname}`;
    
    // Upload to Supabase Storage
    const fileUrl = await this.storage.uploadFile(this.BUCKET_NAME, path, file);

    // Save in DB
    const doc = await this.prisma.kycDocument.create({
      data: {
        userId,
        documentType,
        fileUrl: path, // We store the path, not the signed URL
        status: 'PENDING',
      },
    });

    this.logger.log(`Document ${documentType} uploadé pour l'utilisateur ${userId}`);

    // Si c'est un selfie, on tente une vérification automatique mockée avec l'ID card la plus récente (si elle existe)
    if (documentType === 'SELFIE') {
      this.triggerAutoVerification(userId).catch(e => this.logger.error(e));
    }

    return doc;
  }

  async getStatus(userId: string) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    const documents = await this.prisma.kycDocument.findMany({ where: { userId } });
    
    return {
      kycLevel: profile?.kycLevel || 1,
      kycStatus: profile?.kycStatus || 'PENDING',
      documents,
    };
  }

  async getPendingDocuments() {
    // Retourne la file d'attente pour les modérateurs
    return this.prisma.kycDocument.findMany({
      where: { status: 'PENDING' },
      include: { user: { select: { email: true, profile: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async approveDocument(docId: string) {
    const doc = await this.prisma.kycDocument.update({
      where: { id: docId },
      data: { status: 'VERIFIED' },
    });

    // Optionnel: Mettre à jour le statut global de l'utilisateur
    await this.updateUserProfileStatus(doc.userId);

    this.logger.log(`Document ${docId} approuvé`);
    return doc;
  }

  async rejectDocument(docId: string, reason: string) {
    const doc = await this.prisma.kycDocument.update({
      where: { id: docId },
      data: { status: 'REJECTED', rejectionReason: reason },
    });

    await this.prisma.profile.update({
      where: { userId: doc.userId },
      data: { kycStatus: 'REJECTED' },
    });

    this.logger.log(`Document ${docId} rejeté: ${reason}`);
    return doc;
  }

  /**
   * Pour consultation sécurisée par le modérateur
   */
  async getSignedUrl(docId: string) {
    const doc = await this.prisma.kycDocument.findUnique({ where: { id: docId } });
    if (!doc) throw new NotFoundException('Document introuvable');
    
    return this.storage.createSignedUrl(this.BUCKET_NAME, doc.fileUrl);
  }

  private async triggerAutoVerification(userId: string) {
    // Trouve la carte d'identité la plus récente et le selfie
    const docs = await this.prisma.kycDocument.findMany({
      where: { userId, status: 'PENDING' },
      orderBy: { createdAt: 'desc' }
    });

    const idCard = docs.find(d => d.documentType === 'ID_CARD' || d.documentType === 'PASSPORT');
    const selfie = docs.find(d => d.documentType === 'SELFIE');

    if (idCard && selfie) {
      // Mock verification
      const result = await this.kycVerifier.verifyIdentity(idCard.fileUrl, selfie.fileUrl);
      
      if (result.isValid) {
        await this.prisma.kycDocument.updateMany({
          where: { id: { in: [idCard.id, selfie.id] } },
          data: { status: 'VERIFIED' }
        });
        await this.updateUserProfileStatus(userId);
      } else {
        await this.prisma.kycDocument.updateMany({
          where: { id: { in: [idCard.id, selfie.id] } },
          data: { status: 'REJECTED', rejectionReason: result.reason }
        });
        await this.prisma.profile.update({
          where: { userId },
          data: { kycStatus: 'REJECTED' }
        });
      }
    }
  }

  private async updateUserProfileStatus(userId: string) {
    // Si l'utilisateur a au moins un document validé (simplification pour le MVP)
    await this.prisma.profile.update({
      where: { userId },
      data: { 
        kycStatus: 'VERIFIED',
        kycLevel: 2 // Passe au niveau vérifié
      },
    });
  }
}
