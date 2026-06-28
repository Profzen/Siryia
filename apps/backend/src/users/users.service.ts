import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { roles: true }
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
    });
  }

  async updateProfile(userId: string, data: { phone?: string; firstName?: string; lastName?: string; bio?: string }) {
    const { phone, firstName, lastName, bio } = data;
    
    // Update User (phone) and Profile (firstName, lastName, bio)
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(phone && { phone }),
        profile: {
          upsert: {
            create: { firstName, lastName, bio },
            update: { firstName, lastName, bio },
          },
        },
      },
      include: {
        profile: true,
      },
    });
  }
}
