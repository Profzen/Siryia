import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { KycService } from './kyc.service';
import { KycController } from './kyc.controller';
import { KycAdminController } from './kyc-admin.controller';
import { StorageService } from '../providers/storage.service';
import { MockKycService } from '../providers/mock-kyc.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [KycController, KycAdminController],
  providers: [KycService, StorageService, MockKycService],
  exports: [KycService],
})
export class KycModule {}
