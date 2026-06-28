import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface AnnuaireQuery {
  q?: string;
  category?: string;
  type?: 'SOLO' | 'COMPANY';
  verifiedOnly?: boolean;
}

@Injectable()
export class AnnuaireService {
  constructor(private prisma: PrismaService) {}

  async search(query: AnnuaireQuery) {
    const results: any[] = [];
    const searchString = query.q?.toLowerCase() || '';

    // 1. Fetch Company profiles if not filtering for Solo only
    if (query.type !== 'SOLO') {
      const companies = await this.prisma.company.findMany({
        where: {
          AND: [
            // If verifiedOnly is true, formal companies must be verified. Informal collectives are verified by default.
            query.verifiedOnly 
              ? { kybStatus: 'VERIFIED' } 
              : {},
            searchString 
              ? {
                  OR: [
                    { name: { contains: searchString, mode: 'insensitive' } },
                    { bio: { contains: searchString, mode: 'insensitive' } },
                    { address: { contains: searchString, mode: 'insensitive' } },
                  ]
                }
              : {},
          ]
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  profile: true,
                }
              }
            }
          }
        }
      });

      companies.forEach((comp) => {
        results.push({
          id: comp.id,
          type: 'COMPANY',
          name: comp.name,
          bio: comp.bio || 'Aucune biographie fournie.',
          logoUrl: comp.logoUrl || 'https://placehold.co/200x200/17519B/FFFFFF/png?text=' + encodeURIComponent(comp.name),
          phone: comp.phone,
          email: comp.email,
          address: comp.address,
          isInformal: comp.isInformal,
          isVerified: comp.isInformal || comp.kybStatus === 'VERIFIED',
          rating: 4.8, // Mock default rating
        });
      });
    }

    // 2. Fetch Solo Provider profiles if not filtering for Company only
    if (query.type !== 'COMPANY') {
      const soloProviders = await this.prisma.user.findMany({
        where: {
          AND: [
            // Must have the PROVIDER role
            {
              roles: {
                some: {
                  roleId: 'PROVIDER',
                },
              },
            },
            // If verifiedOnly is true, must be KYC verified
            query.verifiedOnly
              ? {
                  profile: {
                    kycStatus: 'VERIFIED',
                  },
                }
              : {},
            searchString
              ? {
                  OR: [
                    {
                      profile: {
                        OR: [
                          { firstName: { contains: searchString, mode: 'insensitive' } },
                          { lastName: { contains: searchString, mode: 'insensitive' } },
                          { bio: { contains: searchString, mode: 'insensitive' } },
                        ],
                      },
                    },
                    { email: { contains: searchString, mode: 'insensitive' } },
                  ],
                }
              : {},
          ],
        },
        include: {
          profile: true,
        },
      });

      soloProviders.forEach((user) => {
        const name = user.profile?.firstName || user.profile?.lastName
          ? `${user.profile.firstName || ''} ${user.profile.lastName || ''}`.trim()
          : user.email || 'Prestataire Indépendant';
          
        results.push({
          id: user.id,
          type: 'SOLO',
          name,
          bio: user.profile?.bio || 'Aucune biographie fournie.',
          logoUrl: user.profile?.avatarUrl || 'https://placehold.co/200x200/D49A25/FFFFFF/png?text=' + encodeURIComponent(name),
          phone: user.phone,
          email: user.email,
          address: 'Togo',
          isInformal: false,
          isVerified: user.profile?.kycStatus === 'VERIFIED',
          rating: 4.9, // Mock default rating
        });
      });
    }

    return results;
  }
}
