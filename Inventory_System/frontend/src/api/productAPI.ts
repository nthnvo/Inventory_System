// src/api/productAPI.ts
import axiosClient from './axiosClient';
import { Product, Category } from '../types';

type CreateProductInput = {
  name: string;
  price: number;
  stock: number;
  description?: string | null;
  categoryId?: number | null;
};
type UpdateProductInput = Partial<CreateProductInput>;

export type ProductSearchParams = {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  category?: number; // ตรงกับ @Query('category') ฝั่ง backend
};

export const productAPI = {
  // Categories
  async getAllCategories(): Promise<Category[]> {
    const res = await axiosClient.get('/categories');
    return res.data;
  },
   async searchProducts(params: ProductSearchParams): Promise<Product[]> {
    const res = await axiosClient.get('/products/search', {
      params: {
        ...(params.name ? { name: params.name } : {}),
        ...(Number.isFinite(params.minPrice!) ? { minPrice: params.minPrice } : {}),
        ...(Number.isFinite(params.maxPrice!) ? { maxPrice: params.maxPrice } : {}),
        ...(params.category ? { category: params.category } : {}),
      },
    });
    return res.data;
  },

  // Products
  async getAllProducts(query?: string, categoryId?: string): Promise<Product[]> {
    const params: Record<string, string> = {};
    if (query) params.q = query;
    if (categoryId) params.category = categoryId;
    const res = await axiosClient.get('/products', { params });
    return res.data;
  },

  async getProductById(id: number): Promise<Product> {
    const res = await axiosClient.get(`/products/${id}`);
    return res.data;
  },

  async createProduct(data: CreateProductInput): Promise<Product> {
    // ✅ “ตรึง” payload ให้เป็น plain JSON ชัดเจน
    const payload: CreateProductInput = {
      name: String(data.name).trim(),
      price: Number(data.price),
      stock: Number(data.stock),
      description:
        data.description === undefined || data.description === ''
          ? null
          : String(data.description),
      categoryId:
        data.categoryId === undefined || data.categoryId === null
          ? null
          : Number(data.categoryId),
    };

    console.log('[API] createProduct payload =', payload, 'JSON =', JSON.stringify(payload));
    const res = await axiosClient.post('/products', payload);
    return res.data;
  },

  async updateProduct(id: number, data: UpdateProductInput): Promise<Product> {
    const payload: UpdateProductInput = {
      ...(data.name !== undefined ? { name: String(data.name).trim() } : {}),
      ...(data.price !== undefined ? { price: Number(data.price) } : {}),
      ...(data.stock !== undefined ? { stock: Number(data.stock) } : {}),
      ...(data.description !== undefined
        ? { description: data.description === '' ? null : String(data.description) }
        : {}),
      ...(data.categoryId !== undefined
        ? { categoryId: data.categoryId === null ? null : Number(data.categoryId) }
        : {}),
    };

    console.log('[API] updateProduct payload =', payload, 'JSON =', JSON.stringify(payload));
    const res = await axiosClient.patch(`/products/${id}`, payload);
    return res.data;
  },

  async deleteProduct(id: number): Promise<void> {
    await axiosClient.delete(`/products/${id}`);
  },
};
