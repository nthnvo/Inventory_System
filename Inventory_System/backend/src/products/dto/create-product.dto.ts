import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString() @IsNotEmpty()
  name: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  price: number;

  @Type(() => Number)
  @IsInt() @Min(0)
  stock: number;

  @IsOptional() @IsString()
  description?: string;

  // ตรงกับฟรอนต์: categoryId (ไม่ใช่ category_id)
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number | null;
}
