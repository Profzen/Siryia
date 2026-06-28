import { Controller, Get, Post, Body, Param, UseGuards, Req, Patch } from '@nestjs/common';
import { RecrutementService } from './recrutement.service';
import { CreateServiceRequestDto, CreateProposalDto } from './dto/recrutement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Recrutement & Services')
@Controller('api/recrutement')
export class RecrutementController {
  constructor(private readonly recrutementService: RecrutementService) {}

  @Get('requests')
  @ApiOperation({ summary: 'List all open service requests' })
  async findAll() {
    return this.recrutementService.findAllRequests();
  }

  @Get('requests/:id')
  @ApiOperation({ summary: 'Get details of a specific service request' })
  async findOne(@Param('id') id: string) {
    return this.recrutementService.findOneRequest(id);
  }

  @Post('requests')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish a new service request' })
  async createRequest(@Req() req: any, @Body() dto: CreateServiceRequestDto) {
    return this.recrutementService.createRequest(req.user.id, dto);
  }

  @Post('requests/:id/proposals')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a proposal for a service request' })
  async createProposal(
    @Param('id') requestId: string,
    @Req() req: any,
    @Body() dto: CreateProposalDto,
  ) {
    return this.recrutementService.createProposal(req.user.id, requestId, dto);
  }

  @Patch('proposals/:id/accept')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept a proposal and initiate escrow payment' })
  async acceptProposal(
    @Param('id') proposalId: string,
    @Req() req: any,
    @Body() paymentDetails: { providerName: string; phone: string },
  ) {
    return this.recrutementService.acceptProposal(
      req.user.id, 
      proposalId, 
      paymentDetails.providerName, 
      paymentDetails.phone
    );
  }

  @Patch('requests/:id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark a service request as completed and release escrow' })
  async completeRequest(
    @Param('id') requestId: string,
    @Req() req: any,
    @Body() dto: import('./dto/recrutement.dto').CompleteRequestDto,
  ) {
    return this.recrutementService.completeRequest(req.user.id, requestId, dto.paymentId);
  }

  @Patch('requests/:id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel a service request' })
  async cancelRequest(@Param('id') requestId: string, @Req() req: any) {
    return this.recrutementService.cancelRequest(req.user.id, requestId);
  }

  @Post('requests/:id/reviews')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit a review for a completed service request' })
  async submitReview(
    @Param('id') requestId: string,
    @Req() req: any,
    @Body() dto: import('./dto/recrutement.dto').SubmitReviewDto,
  ) {
    return this.recrutementService.submitReview(req.user.id, requestId, dto.rating, dto.comment || '');
  }
}
