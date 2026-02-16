// src/features/products/productSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { productAPI } from '../../api/productAPI';
import type { Product } from '../../types';
import type { ProductSearchParams } from '../../api/productAPI';

/**
 * ---------- State ----------
 */
export interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

/**
 * ---------- DTOs (ให้ตรงกับฝั่ง API) ----------
 * หมายเหตุ: ฝั่ง UI อาจเก็บ categoryId เป็น null ได้
 * แต่ก่อนเรียก API เราจะแปลง null -> undefined เสมอ
 */
export interface CreateProductDto {
  name: string;
  price: number;
  stock: number;
  description?: string;
  categoryId?: number; // API ไม่รับ null
}

export interface UpdateProductDto {
  name?: string;
  price?: number;
  stock?: number;
  description?: string;
  categoryId?: number; // API ไม่รับ null
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

/**
 * ---------- Thunks ----------
 */
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params?: { query?: string; categoryId?: string }) => {
    const response = await productAPI.getAllProducts(params?.query, params?.categoryId);
    return response;
  }
);

export const fetchProductsAdvanced = createAsyncThunk(
  'products/search',
  async (params: ProductSearchParams) => {
    const response = await productAPI.searchProducts(params);
    return response;
  }
);

export const createProduct = createAsyncThunk(
  'products/create',
  // อนุญาตให้ caller ส่ง categoryId เป็น number | null มาได้ แต่จะแปลงให้ก่อน
  async (raw: Omit<CreateProductDto, 'categoryId'> & { categoryId?: number | null }) => {
    const data: CreateProductDto = {
      ...raw,
      // แปลง null -> undefined ให้ตรง type ที่ API ต้องการ
      categoryId: raw.categoryId ?? undefined,
    };
    const response = await productAPI.createProduct(data);
    return response;
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  // ให้พารามิเตอร์เป็น { id, body } ตามที่หน้าฟอร์มเรียกใช้
  async (params: { id: number; body: Omit<UpdateProductDto, 'categoryId'> & { categoryId?: number | null } }) => {
    const patch: UpdateProductDto = {
      ...params.body,
      categoryId: params.body.categoryId ?? undefined,
    };
    const response = await productAPI.updateProduct(params.id, patch);
    return response;
  }
);

export const deleteProduct = createAsyncThunk('products/delete', async (id: number) => {
  await productAPI.deleteProduct(id);
  return id;
});

/**
 * ---------- Slice ----------
 */
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsAdvanced.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsAdvanced.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProductsAdvanced.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search products';
      })
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })

      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.products.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create product';
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        const index = state.products.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update product';
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.products = state.products.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete product';
      });
  },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer;
