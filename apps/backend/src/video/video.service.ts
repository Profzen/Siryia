import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VideoService {
  constructor(private prisma: PrismaService) {}

  async createSession(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new BadRequestException("Réservation introuvable");
    }

    const roomName = `room-${bookingId}`;
    
    // Simuler la génération de token LiveKit
    const mockToken = `mock-token-${bookingId}-${Math.random().toString(36).substring(7)}`;

    return this.prisma.videoSession.create({
      data: {
        bookingId,
        roomName,
        token: mockToken,
        status: 'PENDING',
      },
    });
  }

  async getSession(bookingId: string) {
    return this.prisma.videoSession.findUnique({
      where: { bookingId },
    });
  }

  async updateSessionStatus(bookingId: string, status: string) {
    return this.prisma.videoSession.update({
      where: { bookingId },
      data: { status },
    });
  }
}
