// src/utils/store.ts
import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from '../features/products/categorySlice';
import productReducer from '../features/products/productSlice';

export const store = configureStore({
  reducer: {
    categories: categoryReducer,
    products: productReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;