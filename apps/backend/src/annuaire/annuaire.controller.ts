import { Controller, Get, Query, Param, NotFoundException } from '@nestjs/common';
import { AnnuaireService } from './annuaire.service';
import { PrismaService } from '../prisma/prisma.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Annuaire Professionnel')
@Controller('api/annuaire')
export class AnnuaireController {
  constructor(
    private readonly annuaireService: AnnuaireService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Search professionals (solos & companies)' })
  async search(
    @Query('q') q?: string,
    @Query('category') category?: string,
    @Query('type') type?: 'SOLO' | 'COMPANY',
    @Query('verifiedOnly') verifiedOnly?: string,
  ) {
    const isVerifiedOnly = verifiedOnly === 'true' || verifiedOnly === '1';
    return this.annuaireService.search({
      q,
      category,
      type,
      verifiedOnly: isVerifiedOnly,
    });
  }

  @Get('solo/:id')
  @ApiOperation({ summary: 'Get public vitrine details for a solo professional' })
  async getSoloProfile(@Param('id') id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        roles: true,
      },
    });

    // Make sure they have the PROVIDER role
    const isProvider = user?.roles.some((r) => r.roleId === 'PROVIDER');
    if (!user || !isProvider) {
      throw new NotFoundException('Prestataire introuvable');
    }

    const name = user.profile?.firstName || user.profile?.lastName
      ? `${user.profile.firstName || ''} ${user.profile.lastName || ''}`.trim()
      : user.email || 'Prestataire Indépendant';

    return {
      id: user.id,
      type: 'SOLO',
      name,
      bio: user.profile?.bio,
      avatarUrl: user.profile?.avatarUrl,
      kycLevel: user.profile?.kycLevel,
      isVerified: user.profile?.kycStatus === 'VERIFIED',
      email: user.email,
      phone: user.phone,
    };
  }

  @Get('company/:id')
  @ApiOperation({ summary: 'Get public vitrine details for a company or collective' })
  async getCompanyProfile(@Param('id') id: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                profile: true,
              },
            },
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException('Structure introuvable');
    }

    return {
      id: company.id,
      type: 'COMPANY',
      name: company.name,
      bio: company.bio,
      logoUrl: company.logoUrl,
      rccm: company.rccm,
      taxId: company.taxId,
      address: company.address,
      phone: company.phone,
      email: company.email,
      isInformal: company.isInformal,
      isVerified: company.isInformal || company.kybStatus === 'VERIFIED',
      members: company.members.map((m) => ({
        id: m.user.id,
        role: m.role,
        email: m.user.email,
        name: `${m.user.profile?.firstName || ''} ${m.user.profile?.lastName || ''}`.trim() || m.user.email,
        avatarUrl: m.user.profile?.avatarUrl,
      })),
    };
  }
}
