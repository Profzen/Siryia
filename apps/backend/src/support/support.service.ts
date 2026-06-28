import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto, AddMessageDto } from './support.dto';

@Injectable()
export class SupportService {
  constructor(private readonly prisma: PrismaService) {}

  async createTicket(userId: string, data: CreateTicketDto) {
    return this.prisma.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        type: data.type,
        reporterId: userId,
        orderId: data.orderId,
        serviceRequestId: data.serviceRequestId,
      },
    });
  }

  async getUserTickets(userId: string) {
    return this.prisma.ticket.findMany({
      where: { reporterId: userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });
  }

  async getTicketDetails(userId: string, ticketId: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: {
              select: {
                id: true,
                email: true,
                profile: {
                  select: { firstName: true, lastName: true, avatarUrl: true },
                },
              },
            },
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket introuvable');
    }

    if (ticket.reporterId !== userId) {
      // Vérification des droits : l'utilisateur n'est pas le reporter
      // (TODO: Autoriser les administrateurs)
      throw new ForbiddenException('Vous ne pouvez pas accéder à ce ticket');
    }

    return ticket;
  }

  async addMessage(userId: string, ticketId: string, data: AddMessageDto) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket introuvable');
    }

    if (ticket.reporterId !== userId) {
      throw new ForbiddenException('Vous ne pouvez pas ajouter de message à ce ticket');
    }

    // Ajouter le message
    const message = await this.prisma.ticketMessage.create({
      data: {
        ticketId,
        senderId: userId,
        content: data.content,
        attachments: data.attachments || [],
      },
    });

    // Mettre à jour la date de modification du ticket
    await this.prisma.ticket.update({
      where: { id: ticketId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async getFaqArticles(locale: string = 'fr') {
    return this.prisma.knowledgeArticle.findMany({
      where: { isPublished: true, locale },
      orderBy: { createdAt: 'desc' },
    });
  }
}
