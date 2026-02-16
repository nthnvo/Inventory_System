// src/types/index.ts

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  description?: string | null;
  category?: Category | null;
  categoryId?: number | null; // ✅ เพิ่มบรรทัดนี้
}