import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[API]', err?.response?.status, err?.config?.url, err?.message);
    return Promise.reject(err);
  }
);

export const productAPI = {
  list: (params?: { q?: string; categoryId?: number }) => api.get('/products', { params }).then(r => r.data),
  get:  (id: number) => api.get(`/products/${id}`).then(r => r.data),
  create: (body: Omit<import('../types').Product, 'id'>) => api.post('/products', body).then(r => r.data),
  update: (id: number, body: Partial<import('../types').Product>) => api.patch(`/products/${id}`, body).then(r => r.data),
  delete: (id: number) => api.delete(`/products/${id}`).then(r => r.data),
};
export const categoryAPI = {
  list: () => api.get('/categories').then(r => r.data),
};
