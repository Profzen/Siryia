import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { KycService } from './kyc.service';

@Controller('admin/kyc')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'MODERATOR') // Only users with these roles can access
export class KycAdminController {
  constructor(private readonly kycService: KycService) {}

  @Get('pending')
  async getPendingDocuments() {
    return this.kycService.getPendingDocuments();
  }

  @Get(':id/url')
  async getDocumentSignedUrl(@Param('id') id: string) {
    const signedUrl = await this.kycService.getSignedUrl(id);
    return { signedUrl };
  }

  @Post(':id/approve')
  async approveDocument(@Param('id') id: string) {
    return this.kycService.approveDocument(id);
  }

  @Post(':id/reject')
  async rejectDocument(
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return this.kycService.rejectDocument(id, reason);
  }
}
