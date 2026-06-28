import { Controller, Get, Post, Body, Param, Put, Query, Req, UseGuards } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('vehicles')
@UseGuards(JwtAuthGuard)
export class VehiclesController {
  constructor(private vehiclesService: VehiclesService) {}

  @Post()
  async createVehicle(@Req() req: any, @Body() data: any) {
    return this.vehiclesService.createVehicle(req.user.id, data);
  }

  @Get()
  async getVehicles(
    @Query('type') type?: string,
    @Query('make') make?: string,
    @Query('isForRent') isForRent?: string,
    @Query('isForSale') isForSale?: string
  ) {
    return this.vehiclesService.getVehicles({
      type,
      make,
      isForRent: isForRent ? isForRent === 'true' : undefined,
      isForSale: isForSale ? isForSale === 'true' : undefined,
    });
  }

  @Post('rent')
  async createRental(
    @Req() req: any,
    @Body() body: { vehicleId: string; startDate: string; endDate: string; totalAmount: number }
  ) {
    return this.vehiclesService.createRental(req.user.id, {
      vehicleId: body.vehicleId,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      totalAmount: body.totalAmount,
    });
  }

  @Post('inspection')
  async submitInspection(
    @Req() req: any,
    @Body() body: { rentalId: string; vehicleId: string; type: string; checklist: any; photos: string[] }
  ) {
    return this.vehiclesService.submitInspection(req.user.id, body);
  }

  @Post('buy/:id')
  async buyVehicle(@Req() req: any, @Param('id') vehicleId: string) {
    return this.vehiclesService.buyVehicle(req.user.id, vehicleId);
  }
}
