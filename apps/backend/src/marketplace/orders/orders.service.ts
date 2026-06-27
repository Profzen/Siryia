import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { PaymentService } from '../../payment/payment.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private paymentService: PaymentService,
  ) {}

  async create(buyerId: string, createOrderDto: CreateOrderDto) {
    if (!createOrderDto.items || createOrderDto.items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    // 1. Create order and decrement stock in transaction
    const order = await this.prisma.$transaction(async (prisma) => {
      let totalAmount = 0;
      const orderItemsData = [];

      for (const item of createOrderDto.items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new BadRequestException(`Product with ID ${item.productId} not found`);
        }
        if (product.stock < item.quantity) {
          throw new BadRequestException(`Insufficient stock for product ${product.title}`);
        }

        const itemTotal = Number(product.price) * item.quantity;
        totalAmount += itemTotal;

        orderItemsData.push({
          productId: product.id,
          sellerId: product.sellerId,
          quantity: item.quantity,
          unitPrice: product.price,
        });

        // Decrement stock
        await prisma.product.update({
          where: { id: product.id },
          data: { stock: product.stock - item.quantity },
        });
      }

      // Create the order
      return prisma.order.create({
        data: {
          buyerId,
          totalAmount,
          status: 'PENDING',
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      });
    });

    // 2. Initiate Escrow Payment
    try {
      const paymentInitiation = await this.paymentService.initiateEscrowPayment(
        buyerId,
        Number(order.totalAmount),
        createOrderDto.paymentProvider,
        order.id,
        createOrderDto.phone,
      );

      return {
        ...order,
        payment: paymentInitiation,
      };
    } catch (error: any) {
      throw new BadRequestException(
        `Commande créée mais échec d'initiation du paiement: ${error.message || error}`,
      );
    }
  }

  async findMyOrders(buyerId: string) {
    return this.prisma.order.findMany({
      where: { buyerId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        payments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
