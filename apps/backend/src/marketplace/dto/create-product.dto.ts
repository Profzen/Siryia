import { IsString, IsNumber, IsOptional, IsArray, IsEnum, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ProductCondition {
  NEW = 'NEW',
  USED_LIKE_NEW = 'USED_LIKE_NEW',
  USED_GOOD = 'USED_GOOD',
  USED_FAIR = 'USED_FAIR',
}

export class CreateProductDto {
  @ApiProperty({ description: 'Category ID' })
  @IsString()
  categoryId: string;

  @ApiProperty({ description: 'Product title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Product description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Product price' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Stock quantity' })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({ enum: ProductCondition, description: 'Product condition' })
  @IsEnum(ProductCondition)
  condition: string;

  @ApiProperty({ description: 'List of image URLs', required: false, type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];
}
