import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentService } from '../payment/payment.service';
import { CreateServiceRequestDto, CreateProposalDto } from './dto/recrutement.dto';

@Injectable()
export class RecrutementService {
  constructor(
    private prisma: PrismaService,
    private paymentService: PaymentService,
  ) {}

  async createRequest(clientId: string, dto: CreateServiceRequestDto) {
    return this.prisma.serviceRequest.create({
      data: {
        clientId,
        title: dto.title,
        description: dto.description,
        budget: dto.budget,
        status: 'OPEN',
      },
    });
  }

  async findAllRequests(categoryId?: string) {
    // Return all open requests
    return this.prisma.serviceRequest.findMany({
      where: {
        status: 'OPEN',
        // If category is needed, we would need to add categoryId to ServiceRequest model or link it.
        // Wait, looking at schema, ServiceRequest doesn't have categoryId. We'll skip filtering for now.
      },
      include: {
        client: {
          select: {
            id: true,
            email: true,
            profile: true,
          }
        },
        _count: {
          select: { proposals: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneRequest(id: string) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            email: true,
            profile: true,
          }
        },
        proposals: {
          include: {
            provider: {
              select: {
                id: true,
                email: true,
                profile: true,
              }
            }
          }
        }
      }
    });

    if (!request) {
      throw new NotFoundException('Besoin introuvable');
    }
    return request;
  }

  async createProposal(providerId: string, requestId: string, dto: CreateProposalDto) {
    // 1. Check if request exists and is open
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new NotFoundException('Besoin introuvable');
    }
    if (request.status !== 'OPEN') {
      throw new BadRequestException('Ce besoin n\'est plus ouvert aux propositions');
    }

    // 2. Check if provider already proposed
    const existing = await this.prisma.proposal.findFirst({
      where: {
        serviceRequestId: requestId,
        providerId,
      }
    });

    if (existing) {
      throw new BadRequestException('Vous avez déjà soumis une proposition pour ce besoin');
    }

    // 3. Create proposal
    return this.prisma.proposal.create({
      data: {
        serviceRequestId: requestId,
        providerId,
        amount: dto.amount,
        message: dto.message,
        status: 'PENDING',
      },
    });
  }

  async acceptProposal(clientId: string, proposalId: string, providerName: string, phone: string) {
    return this.prisma.$transaction(async (prisma) => {
      const proposal = await prisma.proposal.findUnique({
        where: { id: proposalId },
        include: { request: true },
      });

      if (!proposal) {
        throw new NotFoundException('Proposition introuvable');
      }

      if (proposal.request.clientId !== clientId) {
        throw new ForbiddenException('Seul l\'auteur du besoin peut accepter une proposition');
      }

      if (proposal.request.status !== 'OPEN') {
        throw new BadRequestException('Le besoin est déjà fermé ou en cours');
      }

      // 1. Mark proposal as accepted and request as IN_PROGRESS
      await prisma.proposal.update({
        where: { id: proposalId },
        data: { status: 'ACCEPTED' }
      });

      await prisma.serviceRequest.update({
        where: { id: proposal.request.id },
        data: { status: 'IN_PROGRESS' }
      });

      // Reject all other proposals for this request
      await prisma.proposal.updateMany({
        where: {
          serviceRequestId: proposal.request.id,
          id: { not: proposalId },
          status: 'PENDING'
        },
        data: { status: 'REJECTED' }
      });

      // 2. Initiate Escrow Payment
      // Note: we pass undefined for orderId since this is a service request, not a product order.
      // The amount is converted to number since Prisma Decimal requires it.
      const paymentResult = await this.paymentService.initiateEscrowPayment(
        clientId,
        Number(proposal.amount),
        providerName, // 'TMONEY' or 'MOOV'
        undefined,
        phone
      );

      // Pour lier le paiement au service request (simplifié pour ce MVP, on devrait stocker le paymentId dans ServiceRequest ou lier le Payment à ServiceRequest)
      // Pour l'instant, on laisse tel quel car le système Payment est conçu pour les Orders (orderId).
      // Dans le futur, adapter le modèle Payment pour supporter un serviceRequestId.

      return {
        success: true,
        proposalId,
        payment: paymentResult,
      };
    });
  }

  async completeRequest(clientId: string, requestId: string, paymentIdToRelease: string) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: { proposals: { where: { status: 'ACCEPTED' } } }
    });

    if (!request) throw new NotFoundException('Besoin introuvable');
    if (request.clientId !== clientId) throw new ForbiddenException('Non autorisé');
    if (request.status !== 'IN_PROGRESS') throw new BadRequestException('Ce besoin n\'est pas en cours');

    // Mettre à jour le statut
    await this.prisma.serviceRequest.update({
      where: { id: requestId },
      data: { status: 'COMPLETED' }
    });

    // Libérer le séquestre
    return this.paymentService.releaseEscrow(paymentIdToRelease, clientId);
  }

  async cancelRequest(clientId: string, requestId: string) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id: requestId }
    });

    if (!request) throw new NotFoundException('Besoin introuvable');
    if (request.clientId !== clientId) throw new ForbiddenException('Non autorisé');
    if (request.status === 'COMPLETED') throw new BadRequestException('Besoin déjà terminé');

    return this.prisma.serviceRequest.update({
      where: { id: requestId },
      data: { status: 'CANCELLED' }
    });
  }

  async submitReview(userId: string, requestId: string, rating: number, comment: string) {
    const request = await this.prisma.serviceRequest.findUnique({
      where: { id: requestId },
      include: { proposals: { where: { status: 'ACCEPTED' } } }
    });

    if (!request) throw new NotFoundException('Besoin introuvable');
    if (request.status !== 'COMPLETED') throw new BadRequestException('Le besoin doit être terminé pour être noté');

    const acceptedProposal = request.proposals[0];
    if (!acceptedProposal) throw new BadRequestException('Aucune proposition acceptée');

    const isClient = request.clientId === userId;
    const isProvider = acceptedProposal.providerId === userId;

    if (!isClient && !isProvider) throw new ForbiddenException('Non autorisé à noter cette mission');

    const targetId = isClient ? acceptedProposal.providerId : request.clientId;

    // Vérifier si déjà noté
    const existing = await this.prisma.review.findFirst({
      where: { reviewerId: userId, serviceRequestId: requestId }
    });

    if (existing) throw new BadRequestException('Vous avez déjà noté cette mission');

    return this.prisma.review.create({
      data: {
        reviewerId: userId,
        targetId,
        serviceRequestId: requestId,
        rating,
        comment,
      }
    });
  }
}
