import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async setAvailability(providerId: string, availabilities: Array<{ dayOfWeek: number; startTime: string; endTime: string }>) {
    // Delete existing availabilities for this provider
    await this.prisma.availability.deleteMany({
      where: { providerId },
    });

    // Create new ones
    return this.prisma.availability.createMany({
      data: availabilities.map(av => ({
        providerId,
        dayOfWeek: av.dayOfWeek,
        startTime: av.startTime,
        endTime: av.endTime,
      })),
    });
  }

  async getAvailability(providerId: string) {
    return this.prisma.availability.findMany({
      where: { providerId },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async createBooking(clientId: string, data: { providerId: string; dateTime: Date; notes?: string }) {
    // Check if slot is within provider availability
    const date = new Date(data.dateTime);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday ...
    
    const timeString = date.toTimeString().substring(0, 5); // e.g. "09:00"

    const availabilities = await this.prisma.availability.findMany({
      where: {
        providerId: data.providerId,
        dayOfWeek,
      },
    });

    const isAvailable = availabilities.some(av => {
      return timeString >= av.startTime && timeString < av.endTime;
    });

    if (!isAvailable) {
      throw new BadRequestException("Le prestataire n'est pas disponible à cette heure.");
    }

    // Check if already booked
    const existing = await this.prisma.booking.findFirst({
      where: {
        providerId: data.providerId,
        dateTime: data.dateTime,
        status: { not: 'CANCELLED' },
      },
    });

    if (existing) {
      throw new BadRequestException("Ce créneau est déjà réservé.");
    }

    return this.prisma.booking.create({
      data: {
        clientId,
        providerId: data.providerId,
        dateTime: data.dateTime,
        notes: data.notes,
      },
    });
  }

  async getBookingsForProvider(providerId: string) {
    return this.prisma.booking.findMany({
      where: { providerId },
      include: { client: { include: { profile: true } } },
      orderBy: { dateTime: 'desc' },
    });
  }

  async getBookingsForClient(clientId: string) {
    return this.prisma.booking.findMany({
      where: { clientId },
      include: { provider: { include: { profile: true } } },
      orderBy: { dateTime: 'desc' },
    });
  }

  async updateBookingStatus(bookingId: string, status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') {
    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });
  }
}
