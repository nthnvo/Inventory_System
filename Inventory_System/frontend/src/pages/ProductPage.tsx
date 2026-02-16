// src/pages/ProductPage.tsx
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { fetchProducts, fetchProductsAdvanced, createProduct, updateProduct, deleteProduct } from '../features/products/productSlice';
import { fetchCategories } from '../features/products/categorySlice';
import { Search, Plus, Edit2, Trash2, Package, X, Check } from 'lucide-react';
import { Product, Category } from '../types';

// Local DTO used for creating/updating products when ../types doesn't export it
interface CreateProductDto {
  name: string;
  price: number;
  stock: number;
  description?: string;
  categoryId: number | null;
}

/* Removed stray top-level example payload that referenced `formData` (which does not exist at module scope).
   The actual payload is constructed inside handleSubmit where `formData` is available. */

const ProductPage = () => {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.products);
  const { categories } = useAppSelector((state) => state.categories);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    categoryId: ''
  });

  const [searchName, setSearchName] = useState('');
  const [minPrice, setMinPrice] = useState('');
  
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('');

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts({ query: searchQuery, categoryId: searchCategory }));
  }, [dispatch, searchQuery, searchCategory]);

  useEffect(() => {
    const t = setTimeout(() => {
      const params = {
        name: searchName.trim() || undefined,
        category: searchCategory ? Number(searchCategory) : undefined,
        minPrice: minPrice !== '' ? Number(minPrice) : undefined,
        
      };
      dispatch(fetchProductsAdvanced(params));
    }, 300);
    return () => clearTimeout(t);
  }, [dispatch, searchName, searchCategory, minPrice,]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  const payload: CreateProductDto = {
    name: formData.name,
    price: parseFloat(formData.price),
    stock: parseInt(formData.stock),
    description: formData.description || undefined,
    categoryId: formData.categoryId ? parseInt(formData.categoryId) : null
  };

  try {
    if (editingId != null) { // กันเคส id = 0 ด้วย
      await dispatch(updateProduct({ id: editingId, body: payload })).unwrap();
    } else {
      await dispatch(createProduct(payload)).unwrap();
    }
    resetForm();
    dispatch(fetchProducts({ query: searchQuery, categoryId: searchCategory }));
  } catch (error) {
    alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
  }
};


  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description || '',
      categoryId: product.categoryId ? product.categoryId.toString() : ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('คุณต้องการลบสินค้านี้ใช่หรือไม่?')) return;

    try {
      await dispatch(deleteProduct(id)).unwrap();
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการลบสินค้า');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      stock: '',
      description: '',
      categoryId: ''
    });
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-blue-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              {editingId ? (
                <>
                  <Edit2 className="w-6 h-6 text-blue-600" />
                  แก้ไขสินค้า
                </>
              ) : (
                <>
                  <Plus className="w-6 h-6 text-blue-600" />
                  เพิ่มสินค้าใหม่
                </>
              )}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
              >
                <X className="w-5 h-5" />
                ยกเลิก
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อสินค้า <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="กรอกชื่อสินค้า"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  หมวดหมู่
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                >
                  <option value="">-- เลือกหมวดหมู่ --</option>
                  {categories.map((cat: Category) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ราคา (บาท) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  จำนวนคงเหลือ <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                คำอธิบาย
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                placeholder="รายละเอียดสินค้า (ถ้ามี)"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-linear-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                <Check className="w-5 h-5" />
                {editingId ? 'บันทึกการแก้ไข' : 'เพิ่มสินค้า'}
              </button>
            </div>
          </form>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-blue-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            ค้นหาสินค้า
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="🔍 ค้นหาจากชื่อสินค้า..."
              />
            </div>

            <div>
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">-- ทุกหมวดหมู่ --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
          <div className="p-6 border-b border-gray-200 bg-linear-to-r from-blue-50 to-white">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              รายการสินค้าทั้งหมด
              <span className="text-sm font-normal text-gray-500">({products.length} รายการ)</span>
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">ไม่พบรายการสินค้า</p>
              <p className="text-sm mt-2">ลองเพิ่มสินค้าใหม่หรือเปลี่ยนเงื่อนไขการค้นหา</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ชื่อสินค้า</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">หมวดหมู่</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">ราคา</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">คงเหลือ</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">คำอธิบาย</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product: Product) => {
                    const category = categories.find((c: Category) => c.id === product.categoryId);
                    return (
                      <tr key={product.id} className="hover:bg-blue-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          #{product.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {category ? (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {category.name}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                          ฿{product.price.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            product.stock > 50 ? 'bg-green-100 text-green-800' :
                            product.stock > 10 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {product.stock} ชิ้น
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                          {product.description || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(product)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                              title="แก้ไข"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                              title="ลบ"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;