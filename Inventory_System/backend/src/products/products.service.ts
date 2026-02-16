// products.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Category } from '../categories/category.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly repo: Repository<Product>,
    @InjectRepository(Category) private readonly catRepo: Repository<Category>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product | null> {
    // ✅ ตรวจสอบให้เข้มงวดขึ้น
    if (
      !dto?.name?.trim() ||
      typeof dto.price !== 'number' ||
      isNaN(dto.price) ||
      typeof dto.stock !== 'number' ||
      isNaN(dto.stock)
    ) {
      throw new BadRequestException('Invalid input: name, price, and stock are required');
    }

    const product = this.repo.create({
      name: dto.name.trim(),
      price: dto.price,
      stock: dto.stock,
      description: dto.description ?? null,
    });

    // map category
    if (dto.categoryId != null) {
      const cat = await this.catRepo.findOne({ where: { id: dto.categoryId } });
      if (!cat) {
        throw new BadRequestException('Invalid categoryId');
      }
      product.category = cat;
    } else {
      product.category = null;
    }

    const saved = await this.repo.save(product);
    return await this.repo.findOne({ where: { id: saved.id }, relations: ['category'] });
  }

  async findOne(id: number) {
  return this.repo.findOne({
    where: { id },
    relations: ['category'],
  });
}


  async advancedSearch(filter: {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: number;
}) {
  const qb = this.repo.createQueryBuilder('product')
    .leftJoinAndSelect('product.category', 'category')

  if (filter.name) {
    qb.andWhere('product.name LIKE :name', { name: `%${filter.name}%` });
  }

  if (filter.minPrice) {
    qb.andWhere('product.price >= :minPrice', { minPrice: filter.minPrice });
  }

  if (filter.maxPrice) {
    qb.andWhere('product.price <= :maxPrice', { maxPrice: filter.maxPrice });
  }

  if (filter.category) {
    qb.andWhere('category.id = :category', { category: filter.category });
  }

  qb.orderBy('product.id', 'DESC');

  return qb.getMany();
}

}