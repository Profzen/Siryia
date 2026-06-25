import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MockPaymentService } from '../providers/payment/mock-payment.service';

@Module({
  imports: [PrismaModule],
  providers: [
    PaymentService,
    {
      provide: 'PAYMENT_PROVIDER',
      useClass: MockPaymentService
    }
  ],
  controllers: [PaymentController],
  exports: [PaymentService]
})
export class PaymentModule {}
