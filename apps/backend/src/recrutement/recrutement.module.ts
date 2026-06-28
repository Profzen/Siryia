import { Module } from '@nestjs/common';
import { RecrutementService } from './recrutement.service';
import { RecrutementController } from './recrutement.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [PrismaModule, PaymentModule],
  controllers: [RecrutementController],
  providers: [RecrutementService],
  exports: [RecrutementService],
})
export class RecrutementModule {}
