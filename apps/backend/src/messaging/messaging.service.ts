import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagingService {
  private readonly logger = new Logger(MessagingService.name);

  constructor(private prisma: PrismaService) {}

  filterContent(content: string): { filteredContent: string; isFiltered: boolean } {
    let isFiltered = false;
    let filteredContent = content;

    // Filter emails
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    if (emailRegex.test(filteredContent)) {
      isFiltered = true;
      filteredContent = filteredContent.replace(emailRegex, '[EMAIL MASQUÉ]');
    }

    // Filter phone numbers (basic regex for African formats)
    const phoneRegex = /(?:\+?\d{1,3}[\s-]?)?(?:\(?\d{2,4}\)?[\s-]?)?\d{2,4}[\s-]?\d{2,4}[\s-]?\d{2,4}/g;
    const potentialPhones = filteredContent.match(phoneRegex);
    if (potentialPhones) {
      for (const match of potentialPhones) {
        // Only replace if it looks long enough to be a phone number
        const digits = match.replace(/\D/g, '');
        if (digits.length >= 8) {
          isFiltered = true;
          filteredContent = filteredContent.replace(match, '[TÉLÉPHONE MASQUÉ]');
        }
      }
    }

    return { filteredContent, isFiltered };
  }

  async saveMessage(data: {
    senderId: string;
    receiverId: string;
    serviceRequestId?: string;
    content?: string;
    attachments?: string[];
    messageType?: 'TEXT' | 'IMAGE' | 'AUDIO' | 'FILE';
  }) {
    let finalContent = data.content;
    let finalIsFiltered = false;

    if (finalContent) {
      const result = this.filterContent(finalContent);
      finalContent = result.filteredContent;
      finalIsFiltered = result.isFiltered;
    }

    return this.prisma.message.create({
      data: {
        senderId: data.senderId,
        receiverId: data.receiverId,
        serviceRequestId: data.serviceRequestId,
        content: finalContent,
        attachments: data.attachments || [],
        messageType: data.messageType || 'TEXT',
        isFiltered: finalIsFiltered,
      },
      include: {
        sender: {
          select: {
            id: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true,
              }
            }
          }
        }
      }
    });
  }

  async getConversation(userId1: string, userId2: string) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ]
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true,
              }
            }
          }
        }
      }
    });
  }

  async getMissionConversation(serviceRequestId: string) {
    return this.prisma.message.findMany({
      where: { serviceRequestId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true,
              }
            }
          }
        }
      }
    });
  }
}
