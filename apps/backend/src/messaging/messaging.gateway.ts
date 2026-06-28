import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessagingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MessagingGateway.name);
  private connectedUsers = new Map<string, string>(); // userId -> socketId

  constructor(
    private readonly messagingService: MessagingService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const authHeader = client.handshake.headers.authorization;
      if (!authHeader) {
        throw new Error('No authorization header');
      }

      const token = authHeader.split(' ')[1];
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'super-secret-siryia-key-change-me-in-prod',
      });
      
      const userId = decoded.sub;
      this.connectedUsers.set(userId, client.id);
      
      // We can also attach userId to socket for easy access
      (client as any).userId = userId;

      this.logger.log(`Client connected: ${client.id} (User: ${userId})`);
    } catch (error) {
      this.logger.error(`Connection failed: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = (client as any).userId;
    if (userId) {
      this.connectedUsers.delete(userId);
      this.logger.log(`Client disconnected: ${client.id} (User: ${userId})`);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: {
      receiverId: string;
      content?: string;
      attachments?: string[];
      messageType?: 'TEXT' | 'IMAGE' | 'AUDIO' | 'FILE';
      serviceRequestId?: string;
    },
  ) {
    const senderId = (client as any).userId;
    if (!senderId) return { error: 'Unauthorized' };

    try {
      const message = await this.messagingService.saveMessage({
        senderId,
        receiverId: payload.receiverId,
        content: payload.content,
        attachments: payload.attachments,
        messageType: payload.messageType,
        serviceRequestId: payload.serviceRequestId,
      });

      // Send to receiver if online
      const receiverSocketId = this.connectedUsers.get(payload.receiverId);
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('newMessage', message);
      }

      // Also send back to sender to confirm (or they can just use the HTTP response/ack)
      return { success: true, data: message };
    } catch (error) {
      this.logger.error(`Failed to send message: ${error.message}`);
      return { error: 'Failed to process message' };
    }
  }
}
