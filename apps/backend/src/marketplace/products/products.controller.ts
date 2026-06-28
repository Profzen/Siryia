import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@ApiTags('Marketplace - Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product (Seller only)' })
  create(@Body() createProductDto: CreateProductDto, @CurrentUser() user: any) {
    return this.productsService.create(user.id, createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products (public)' })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific product by ID' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}
