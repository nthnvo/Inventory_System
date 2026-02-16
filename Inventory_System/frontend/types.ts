// frontend/src/types.ts
export type Category = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;        // backend เป็น decimal แต่ส่งมา/รับไปเป็น number
  description: string | null;
  stock: number;
  category: Category | null;
};

export type CreateProductDto = {
  name: string;
  price: number | string;   // เผื่อกรอกจาก input เป็น string
  description?: string | null;
  stock?: number;
  categoryId?: number | null;
};

export type UpdateProductDto = Partial<CreateProductDto>;
