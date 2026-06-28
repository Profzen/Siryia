import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface SendNotificationDto {
  userId: string;
  title: string;
  body: string;
  type?: 'SYSTEM' | 'MESSAGE' | 'ORDER' | 'SERVICE' | 'PAYMENT';
  actionUrl?: string;
  channels?: ('IN_APP' | 'EMAIL' | 'PUSH')[];
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private prisma: PrismaService) {}

  async send(data: SendNotificationDto) {
    const channels = data.channels || ['IN_APP'];

    let dbNotification = null;

    if (channels.includes('IN_APP')) {
      dbNotification = await this.prisma.notification.create({
        data: {
          userId: data.userId,
          title: data.title,
          body: data.body,
          type: data.type || 'SYSTEM',
          actionUrl: data.actionUrl,
        },
      });
    }

    if (channels.includes('EMAIL')) {
      this.logger.log(`[MOCK EMAIL] Sending to user ${data.userId}: ${data.title}`);
      // TODO: Implement Resend/Postmark logic
    }

    if (channels.includes('PUSH')) {
      this.logger.log(`[MOCK PUSH] Sending to user ${data.userId}: ${data.title}`);
      // TODO: Implement FCM/APNs logic
    }

    return dbNotification;
  }

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId: userId, // Ensure user owns the notification
      },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }
}
