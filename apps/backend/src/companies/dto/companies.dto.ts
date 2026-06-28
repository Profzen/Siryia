import { IsString, IsBoolean, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ description: 'Company name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Whether the company is an informal collective', required: false })
  @IsBoolean()
  @IsOptional()
  isInformal?: boolean;

  @ApiProperty({ description: 'Company bio/description', required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ description: 'Contact phone number', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Contact email address', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'RCCM registry number (required for formal companies)', required: false })
  @IsString()
  @IsOptional()
  rccm?: string;

  @ApiProperty({ description: 'NIF tax ID (required for formal companies)', required: false })
  @IsString()
  @IsOptional()
  taxId?: string;

  @ApiProperty({ description: 'Physical address', required: false })
  @IsString()
  @IsOptional()
  address?: string;
}

export class InviteMemberDto {
  @ApiProperty({ description: 'Email of the user to invite' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Role of the member (e.g. OWNER, ADMIN, EMPLOYEE)' })
  @IsString()
  role: string;
}
