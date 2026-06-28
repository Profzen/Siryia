import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SupportService } from './support.service';
import { CreateTicketDto, AddMessageDto } from './support.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('Support & Ticketing')
@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Get('faq')
  @ApiOperation({ summary: 'Récupérer les articles de la base de connaissances (publique)' })
  @ApiQuery({ name: 'locale', required: false, description: 'Langue de la FAQ (défaut: fr)' })
  async getFaq(@Query('locale') locale?: string) {
    return this.supportService.getFaqArticles(locale);
  }

  @Post('tickets')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un nouveau ticket' })
  async createTicket(@CurrentUser() user: any, @Body() data: CreateTicketDto) {
    return this.supportService.createTicket(user.id, data);
  }

  @Get('tickets')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lister ses propres tickets' })
  async getTickets(@CurrentUser() user: any) {
    return this.supportService.getUserTickets(user.id);
  }

  @Get('tickets/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer les détails d\'un ticket (messages inclus)' })
  async getTicketDetails(@CurrentUser() user: any, @Param('id') id: string) {
    return this.supportService.getTicketDetails(user.id, id);
  }

  @Post('tickets/:id/messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ajouter un message dans un ticket' })
  async addMessage(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() data: AddMessageDto,
  ) {
    return this.supportService.addMessage(user.id, id, data);
  }
}
