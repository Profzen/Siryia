import { Module } from '@nestjs/common';
import { AnnuaireService } from './annuaire.service';
import { AnnuaireController } from './annuaire.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AnnuaireController],
  providers: [AnnuaireService],
  exports: [AnnuaireService],
})
export class AnnuaireModule {}
