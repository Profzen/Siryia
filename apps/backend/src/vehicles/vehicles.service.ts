import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VehiclesService {
  constructor(private prisma: PrismaService) {}

  async createVehicle(ownerId: string, data: any) {
    return this.prisma.vehicle.create({
      data: {
        ownerId,
        type: data.type,
        make: data.make,
        model: data.model,
        year: parseInt(data.year),
        dailyRate: data.dailyRate,
        isForRent: data.isForRent ?? true,
        isForSale: data.isForSale ?? false,
        salePrice: data.salePrice,
        images: data.images || [],
        status: 'AVAILABLE',
      },
    });
  }

  async getVehicles(filters?: { type?: string; make?: string; isForRent?: boolean; isForSale?: boolean }) {
    return this.prisma.vehicle.findMany({
      where: {
        type: filters?.type,
        make: filters?.make,
        isForRent: filters?.isForRent,
        isForSale: filters?.isForSale,
        status: { not: 'SOLD' },
      },
      include: { owner: { include: { profile: true } } },
    });
  }

  async createRental(renterId: string, data: { vehicleId: string; startDate: Date; endDate: Date; totalAmount: number }) {
    // Check vehicle availability
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: data.vehicleId },
    });

    if (!vehicle || vehicle.status !== 'AVAILABLE') {
      throw new BadRequestException("Le véhicule n'est pas disponible");
    }

    // Create rental
    const rental = await this.prisma.rental.create({
      data: {
        vehicleId: data.vehicleId,
        renterId,
        startDate: data.startDate,
        endDate: data.endDate,
        totalAmount: data.totalAmount,
        status: 'PENDING',
      },
    });

    // Create a mock contract
    await this.prisma.rentalContract.create({
      data: {
        rentalId: rental.id,
        vehicleId: data.vehicleId,
        contractPdfUrl: `/contracts/rental-${rental.id}.pdf`,
      },
    });

    return rental;
  }

  async submitInspection(inspectorId: string, data: { rentalId: string; vehicleId: string; type: string; checklist: any; photos: string[] }) {
    const inspection = await this.prisma.inspection.create({
      data: {
        rentalId: data.rentalId,
        vehicleId: data.vehicleId,
        inspectorId,
        type: data.type,
        checklist: data.checklist,
        photos: data.photos,
        signatureUrl: `/signatures/inspector-${inspectorId}.png`,
      },
    });

    if (data.type === 'BEFORE') {
      await this.prisma.rental.update({
        where: { id: data.rentalId },
        data: { status: 'ACTIVE' },
      });
      await this.prisma.vehicle.update({
        where: { id: data.vehicleId },
        data: { status: 'RENTED' },
      });
    } else if (data.type === 'AFTER') {
      await this.prisma.rental.update({
        where: { id: data.rentalId },
        data: { status: 'COMPLETED' },
      });
      await this.prisma.vehicle.update({
        where: { id: data.vehicleId },
        data: { status: 'AVAILABLE' },
      });
    }

    return inspection;
  }

  async buyVehicle(buyerId: string, vehicleId: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle || !vehicle.isForSale || vehicle.status !== 'AVAILABLE') {
      throw new BadRequestException("Le véhicule n'est pas disponible pour la vente");
    }

    // Logic simulating instant ownership change or escrow payment
    await this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        ownerId: buyerId,
        status: 'SOLD',
      },
    });

    return { message: "Félicitations, vous avez acheté le véhicule avec succès !" };
  }
}
