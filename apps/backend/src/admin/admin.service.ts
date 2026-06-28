import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { KycStatus, TicketStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getKpis() {
    const [
      totalUsers,
      totalOrders,
      totalTickets,
      openTickets,
      pendingKyc,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.order.count(),
      this.prisma.ticket.count(),
      this.prisma.ticket.count({ where: { status: 'OPEN' } }),
      this.prisma.profile.count({ where: { kycStatus: 'PENDING' } }),
    ]);

    // Calcul simple GMV (Gross Merchandise Value) sur les commandes terminées
    const completedOrders = await this.prisma.order.findMany({
      where: { status: 'COMPLETED' },
      select: { totalAmount: true },
    });
    const gmv = completedOrders.reduce((acc, order) => acc + Number(order.totalAmount), 0);

    return {
      totalUsers,
      totalOrders,
      gmv,
      totalTickets,
      openTickets,
      pendingKyc,
    };
  }

  async getUsers(skip = 0, take = 50, search?: string) {
    const whereClause = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as any } },
            { phone: { contains: search } },
          ],
        }
      : {};

    const users = await this.prisma.user.findMany({
      where: whereClause,
      skip,
      take,
      include: {
        profile: true,
        roles: { include: { role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.user.count({ where: whereClause });

    return { users, total };
  }

  async updateKycStatus(userId: string, status: KycStatus) {
    const profile = await this.prisma.profile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException('Profil introuvable');

    return this.prisma.profile.update({
      where: { userId },
      data: { kycStatus: status },
    });
  }

  async getTickets(skip = 0, take = 50, status?: TicketStatus) {
    const whereClause = status ? { status } : {};

    const tickets = await this.prisma.ticket.findMany({
      where: whereClause,
      skip,
      take,
      include: {
        reporter: {
          select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } },
        },
        assignee: {
          select: { id: true, email: true },
        },
        _count: { select: { messages: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.ticket.count({ where: whereClause });

    return { tickets, total };
  }

  async getFinance() {
    // Escrow transactions (Payments still in escrow)
    const escrowPayments = await this.prisma.payment.findMany({
      where: { isEscrowed: true, status: 'SUCCESS' },
      include: { order: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const totalEscrow = escrowPayments.reduce((acc, p) => acc + Number(p.amount), 0);

    return {
      totalEscrow,
      recentEscrowPayments: escrowPayments,
    };
  }
}
