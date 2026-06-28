import { Controller, Get, Post, Param, Body, UseGuards, Put } from '@nestjs/common';
import { VideoService } from './video.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('video')
@UseGuards(JwtAuthGuard)
export class VideoController {
  constructor(private videoService: VideoService) {}

  @Post('session')
  async createSession(@Body() body: { bookingId: string }) {
    return this.videoService.createSession(body.bookingId);
  }

  @Get('session/:bookingId')
  async getSession(@Param('bookingId') bookingId: string) {
    return this.videoService.getSession(bookingId);
  }

  @Put('session/:bookingId/status')
  async updateStatus(
    @Param('bookingId') bookingId: string,
    @Body() body: { status: string }
  ) {
    return this.videoService.updateSessionStatus(bookingId, body.status);
  }
}
