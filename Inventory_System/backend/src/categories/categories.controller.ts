import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
// CreateCategoryDto removed because it's not exported from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly svc: CategoriesService) {}
  @Post() create(@Body() dto: any) { return this.svc.create(dto); }
  @Get() findAll() { return this.svc.findAll(); }
}