import { Controller, Get, Post, Body, Param, Put, UseGuards, Req } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Post('availability')
  async setAvailability(@Req() req: any, @Body() availabilities: Array<{ dayOfWeek: number; startTime: string; endTime: string }>) {
    return this.appointmentsService.setAvailability(req.user.id, availabilities);
  }

  @Get('availability/:providerId')
  async getAvailability(@Param('providerId') providerId: string) {
    return this.appointmentsService.getAvailability(providerId);
  }

  @Post('book')
  async createBooking(@Req() req: any, @Body() data: { providerId: string; dateTime: string; notes?: string }) {
    return this.appointmentsService.createBooking(req.user.id, {
      providerId: data.providerId,
      dateTime: new Date(data.dateTime),
      notes: data.notes,
    });
  }

  @Get('provider')
  async getBookingsForProvider(@Req() req: any) {
    return this.appointmentsService.getBookingsForProvider(req.user.id);
  }

  @Get('client')
  async getBookingsForClient(@Req() req: any) {
    return this.appointmentsService.getBookingsForClient(req.user.id);
  }

  @Put('status/:bookingId')
  async updateBookingStatus(
    @Param('bookingId') bookingId: string,
    @Body() body: { status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' }
  ) {
    return this.appointmentsService.updateBookingStatus(bookingId, body.status);
  }
}
