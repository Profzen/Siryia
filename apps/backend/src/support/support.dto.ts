import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsUUID, IsArray } from 'class-validator';
import { TicketPriority, TicketType } from '@prisma/client';

export class CreateTicketDto {
  @ApiProperty({ description: 'Titre du ticket' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Description détaillée' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: TicketPriority, default: TicketPriority.NORMAL })
  @IsEnum(TicketPriority)
  @IsOptional()
  priority?: TicketPriority;

  @ApiProperty({ enum: TicketType, default: TicketType.OTHER })
  @IsEnum(TicketType)
  @IsOptional()
  type?: TicketType;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  orderId?: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  serviceRequestId?: string;
}

export class AddMessageDto {
  @ApiProperty({ description: 'Contenu du message' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];
}
