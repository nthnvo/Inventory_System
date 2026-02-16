import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  price: number;

  @Column('int', { default: 0 })
  stock: number;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  // ความสัมพันธ์ตัวจริง (จะสร้างคอลัมน์ category_id ให้เอง)
  @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category?: Category | null;
}
