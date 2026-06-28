import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { KycModule } from './kyc/kyc.module';
import { PaymentModule } from './payment/payment.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { CompaniesModule } from './companies/companies.module';
import { AnnuaireModule } from './annuaire/annuaire.module';
import { RecrutementModule } from './recrutement/recrutement.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    HealthModule,
    UsersModule,
    AuthModule,
    KycModule,
    PaymentModule,
    MarketplaceModule,
    CompaniesModule,
    AnnuaireModule,
    RecrutementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
