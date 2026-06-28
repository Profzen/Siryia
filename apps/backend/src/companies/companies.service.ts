import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto, InviteMemberDto } from './dto/companies.dto';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(ownerId: string, dto: CreateCompanyDto) {
    return this.prisma.$transaction(async (prisma) => {
      // Create company
      const company = await prisma.company.create({
        data: {
          name: dto.name,
          isInformal: dto.isInformal ?? false,
          bio: dto.bio,
          phone: dto.phone,
          email: dto.email,
          rccm: dto.isInformal ? null : dto.rccm,
          taxId: dto.isInformal ? null : dto.taxId,
          address: dto.address,
          kybStatus: dto.isInformal ? 'VERIFIED' : 'PENDING', // Informal ones don't require KYB review
        },
      });

      // Add owner as member
      await prisma.companyMember.create({
        data: {
          companyId: company.id,
          userId: ownerId,
          role: 'OWNER',
        },
      });

      return company;
    });
  }

  async getMyCompanies(userId: string) {
    return this.prisma.company.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
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
  }

  async findOne(id: string) {
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
      throw new NotFoundException('Entreprise introuvable');
    }
    return company;
  }

  async update(companyId: string, userId: string, dto: Partial<CreateCompanyDto>) {
    await this.checkPermission(companyId, userId);

    return this.prisma.company.update({
      where: { id: companyId },
      data: {
        ...dto,
        // If they change to informal, reset legal info
        rccm: dto.isInformal ? null : dto.rccm,
        taxId: dto.isInformal ? null : dto.taxId,
      },
    });
  }

  async inviteMember(companyId: string, inviterId: string, dto: InviteMemberDto) {
    await this.checkPermission(companyId, inviterId);

    // Find the invited user by email
    const invitedUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!invitedUser) {
      throw new BadRequestException('Utilisateur avec cet email introuvable sur la plateforme');
    }

    // Check if already a member
    const existingMember = await this.prisma.companyMember.findUnique({
      where: {
        userId_companyId: {
          userId: invitedUser.id,
          companyId,
        },
      },
    });

    if (existingMember) {
      throw new BadRequestException('Cet utilisateur est déjà membre de l\'entreprise');
    }

    return this.prisma.companyMember.create({
      data: {
        companyId,
        userId: invitedUser.id,
        role: dto.role,
      },
    });
  }

  private async checkPermission(companyId: string, userId: string) {
    const member = await this.prisma.companyMember.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
    });

    if (!member || (member.role !== 'OWNER' && member.role !== 'ADMIN')) {
      throw new ForbiddenException('Vous n\'avez pas la permission de gérer cette entreprise');
    }
  }
}
