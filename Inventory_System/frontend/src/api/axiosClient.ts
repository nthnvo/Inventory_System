// src/api/axiosClient.ts
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: (import.meta as any).env?.VITE_API_URL,     // เช่น http://localhost:3000
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// log ทุก request/response ช่วยดีบัก
axiosClient.interceptors.request.use((config) => {
  console.log('[HTTP]', config.method?.toUpperCase(), config.url, {
    headers: config.headers,
    data: config.data,
  });
  return config;
});
axiosClient.interceptors.response.use(
  (res) => {
    console.log('[HTTP RES]', res.status, res.config.url, res.data);
    return res;
  },
  (err) => {
    const res = err.response;
    console.error('[HTTP ERR]', res.status, res.config.url, res.data || err.message);
    return Promise.reject(err);
  }
);

export default axiosClient;
