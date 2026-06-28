import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto, InviteMemberDto } from './dto/companies.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Companies & Collectives')
@Controller('companies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a company or collective' })
  async create(@Req() req: any, @Body() dto: CreateCompanyDto) {
    const userId = req.user.id;
    return this.companiesService.create(userId, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get current user\'s companies & collectives' })
  async getMyCompanies(@Req() req: any) {
    const userId = req.user.id;
    return this.companiesService.getMyCompanies(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get specific company details by ID' })
  async findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update company details' })
  async update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: Partial<CreateCompanyDto>,
  ) {
    const userId = req.user.id;
    return this.companiesService.update(id, userId, dto);
  }

  @Post(':id/invite')
  @ApiOperation({ summary: 'Invite a new member to the company' })
  async invite(
    @Param('id') id: string,
    @Req() req: any,
    @Body() dto: InviteMemberDto,
  ) {
    const userId = req.user.id;
    return this.companiesService.inviteMember(id, userId, dto);
  }
}
