import { Controller, Post, Get, UseGuards, UseInterceptors, UploadedFile, Body, Req, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { KycService } from './kyc.service';

@Controller('kyc')
@UseGuards(JwtAuthGuard)
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @Req() req: any,
    @Body('documentType') documentType: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }
    if (!documentType) {
      throw new BadRequestException('documentType manquant (ID_CARD, PASSPORT, SELFIE, RCCM)');
    }

    const userId = req.user.id;
    return this.kycService.uploadDocument(userId, documentType, file);
  }

  @Get('status')
  async getStatus(@Req() req: any) {
    return this.kycService.getStatus(req.user.id);
  }
}
