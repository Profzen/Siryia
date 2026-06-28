import { Controller, Get, Put, Param, Query, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { KycStatus, TicketStatus } from '@prisma/client';

@ApiTags('Administration')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN') // Exige le rôle ADMIN
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('kpi')
  @ApiOperation({ summary: 'Récupérer les KPIs globaux' })
  async getKpis() {
    return this.adminService.getKpis();
  }

  @Get('users')
  @ApiOperation({ summary: 'Lister tous les utilisateurs (avec filtres)' })
  async getUsers(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.getUsers(skip ? parseInt(skip) : 0, take ? parseInt(take) : 50, search);
  }

  @Put('users/:id/kyc')
  @ApiOperation({ summary: 'Mettre à jour le statut KYC d\'un utilisateur' })
  async updateKycStatus(
    @Param('id') userId: string,
    @Body('status') status: KycStatus,
  ) {
    return this.adminService.updateKycStatus(userId, status);
  }

  @Get('tickets')
  @ApiOperation({ summary: 'Lister tous les tickets de support' })
  async getTickets(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('status') status?: TicketStatus,
  ) {
    return this.adminService.getTickets(skip ? parseInt(skip) : 0, take ? parseInt(take) : 50, status);
  }

  @Get('finance')
  @ApiOperation({ summary: 'Voir l\'état financier et l\'Escrow' })
  async getFinance() {
    return this.adminService.getFinance();
  }
}
