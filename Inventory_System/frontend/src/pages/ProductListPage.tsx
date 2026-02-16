// src/pages/ProductListPage.tsx
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { 
  fetchProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  CreateProductDto 
} from '../features/products/productSlice';
import { fetchCategories } from '../features/products/categorySlice';
import { Product, Category } from '../types';

export default function ProductListPage() {
  const dispatch = useAppDispatch();
  
  // ✅ แก้ไข State selector
  const { products, loading, error } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);

  // ค้นหา
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<number | ''>('');

  // ฟอร์ม (เพิ่ม/แก้ไข)
  const empty = { 
    name: '', 
    description: '', 
    price: 0, 
    stock: 0, 
    categoryId: null as number | null 
  };
  
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  // กรองในหน้า (UX ไว)
  const filtered = useMemo(() =>
    products.filter((p: Product) => {
      const matchQ = q ? p.name.toLowerCase().includes(q.toLowerCase()) : true;
      const matchC = cat ? p.categoryId === Number(cat) : true;
      return matchQ && matchC;
    }), [products, q, cat]
  );

  const catName = (product: Product) => categories.find((c: Category) => c.id === product.categoryId)?.name || '-';

  // บันทึก
  const onSave = async () => {
    if (!form.name || !form.categoryId) {
      alert('กรอกชื่อและเลือกหมวดหมู่');
      return;
    }

    const payload: CreateProductDto = {
      name: form.name,
      description: form.description || undefined,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: form.categoryId
    };

    try {
      if (editingId) {
        await dispatch(updateProduct({ id: editingId, body: payload })).unwrap();

        setEditingId(null);
      } else {
        await dispatch(createProduct(payload)).unwrap();
      }
      setForm(empty);
      // รีเฟรชข้อมูล
      dispatch(fetchProducts({ query: q, categoryId: cat ? String(cat) : undefined }));
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const onEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description || '',
      price: p.price,
      stock: p.stock,
      categoryId: p.categoryId ?? null
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDelete = async (id: number) => {
    if (window.confirm('ลบสินค้านี้ใช่ไหม?')) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  const handleApplyFilter = () => {
    dispatch(fetchProducts({ 
      query: q, 
      categoryId: cat ? String(cat) : undefined 
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        {loading && <span className="text-sm">Loading…</span>}
      </header>

      {/* ค้นหา/กรอง */}
      <section className="grid md:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-2xl shadow">
        <input 
          value={q} 
          onChange={(e) => setQ(e.target.value)} 
          placeholder="ค้นหาชื่อสินค้า" 
          className="border rounded-xl px-3 py-2" 
        />
        <select 
          value={cat} 
          onChange={(e) => setCat(e.target.value ? Number(e.target.value) : '')} 
          className="border rounded-xl px-3 py-2"
        >
          <option value="">ทุกหมวดหมู่</option>
          {categories.map((c: Category) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button
          onClick={handleApplyFilter}
          className="rounded-2xl px-4 py-2 border bg-black text-white hover:bg-gray-800 transition"
        >
          Apply
        </button>
      </section>

      {/* ฟอร์ม เพิ่ม/แก้ไข */}
      <section className="bg-white rounded-2xl shadow p-4 space-y-3">
        <h2 className="font-semibold">{editingId ? 'แก้ไขสินค้า' : 'เพิ่มสินค้า'}</h2>
        <div className="grid md:grid-cols-5 gap-3">
          <input 
            className="border rounded-xl px-3 py-2" 
            placeholder="Name"
            value={form.name} 
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input 
            className="border rounded-xl px-3 py-2" 
            placeholder="Price" 
            type="number" 
            min={0}
            step="0.01"
            value={form.price} 
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          />
          <input 
            className="border rounded-xl px-3 py-2" 
            placeholder="Stock" 
            type="number" 
            min={0}
            value={form.stock} 
            onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
          />
          <select 
            className="border rounded-xl px-3 py-2"
            value={form.categoryId || ''}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value ? Number(e.target.value) : null })}
          >
            <option value="">(เลือก) Category</option>
            {categories.map((c: Category) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input 
            className="border rounded-xl px-3 py-2 md:col-span-5" 
            placeholder="Description"
            value={form.description} 
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onSave} 
            className="rounded-2xl px-4 py-2 border bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Save
          </button>
          {editingId && (
            <button 
              onClick={() => { 
                setEditingId(null); 
                setForm(empty); 
              }} 
              className="rounded-2xl px-4 py-2 border hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          )}
        </div>
        {error && <p className="text-red-600 text-sm">Error: {error}</p>}
      </section>

      {/* ตารางรายการ */}
      <section className="bg-white rounded-2xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p: Product, i: number) => (
                <tr key={p.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3">{i + 1}</td>
                  <td className="p-3">
                    <div className="font-medium">{p.name}</div>
                    {p.description && (
                      <div className="text-gray-500 text-xs line-clamp-1">{p.description}</div>
                    )}
                  </td>
                  <td className="p-3">
                    {catName(p) !== '-' ? (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs">
                        {catName(p)}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-3 font-medium">
                    ฿{Number(p.price).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-lg text-xs ${
                      p.stock > 50 ? 'bg-green-100 text-green-800' :
                      p.stock > 10 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button 
                      onClick={() => onEdit(p)} 
                      className="px-3 py-1 rounded-xl border hover:bg-blue-50 transition"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onDelete(p.id)} 
                      className="px-3 py-1 rounded-xl border bg-red-600 text-white hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    ไม่มีสินค้า
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}