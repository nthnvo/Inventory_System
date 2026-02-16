import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  findAll(
    @Query('q') q?: string, 
    @Query('category') category?: string
  ) {
    return (this.service as any).findAll(q, category);
  }
  
   @Get('search')
  searchProducts(
    @Query('name') name?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('category') category?: number,
  ) {
    return this.service.advancedSearch({ name, minPrice, maxPrice, category });
  }


  @Post()
  create(@Body() dto: CreateProductDto) {
    console.log('[CTRL] dto =', dto);
    return this.service.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return (this.service as any).update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return (this.service as any).remove(Number(id));
  }
}
