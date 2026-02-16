import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
// CreateCategoryDto import removed; use Partial<Category> in method signatures
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}
  create(dto: Partial<Category>) { return this.repo.save(this.repo.create(dto)); }
  findAll() { return this.repo.find(); }
}


  