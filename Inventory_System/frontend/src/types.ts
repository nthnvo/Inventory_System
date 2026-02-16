// frontend/src/types.ts
export type Category = {
  id: number;
  name: string;
  description?: string;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  stock: number;
  description?: string | null;
  // ✅ เปลี่ยนจาก categoryId เป็น category object
  category?: Category | null;
  // เพิ่ม categoryId สำหรับใช้ในฟอร์ม (optional)
  categoryId?: number;
};