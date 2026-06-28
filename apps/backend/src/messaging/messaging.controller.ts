import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('messaging')
@UseGuards(JwtAuthGuard)
export class MessagingController {
  constructor(private readonly messagingService: MessagingService) {}

  @Get('conversations/:userId')
  async getConversation(
    @CurrentUser() user: any,
    @Param('userId') targetUserId: string,
  ) {
    return this.messagingService.getConversation(user.id, targetUserId);
  }

  @Get('missions/:missionId')
  async getMissionConversation(@Param('missionId') missionId: string) {
    return this.messagingService.getMissionConversation(missionId);
  }
}
