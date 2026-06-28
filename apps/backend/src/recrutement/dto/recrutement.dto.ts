import { IsString, IsDecimal, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceRequestDto {
  @ApiProperty({ description: 'Title of the service request' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Detailed description of the service required' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Estimated budget for the service request', required: false })
  @IsNumber()
  @Min(1)
  @IsOptional()
  budget?: number;

  @ApiProperty({ description: 'ID of the marketplace category' })
  @IsString()
  categoryId: string;
}

export class CreateProposalDto {
  @ApiProperty({ description: 'Bid amount for the service request' })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ description: 'Detailed bid message / proposal details' })
  @IsString()
  message: string;
}

export class CompleteRequestDto {
  @ApiProperty({ description: 'The payment ID to release escrow' })
  @IsString()
  paymentId: string;
}

export class SubmitReviewDto {
  @ApiProperty({ description: 'Rating from 1 to 5' })
  @IsNumber()
  @Min(1)
  rating: number;

  @ApiProperty({ description: 'Comment for the review', required: false })
  @IsString()
  @IsOptional()
  comment?: string;
}
