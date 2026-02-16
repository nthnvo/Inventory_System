import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../utils/hooks';
import { createProduct, fetchProducts, updateProduct } from '../features/products/productSlice';
import { fetchCategories } from '../features/products/categorySlice';


type Props = { mode: 'create' | 'edit' };

export default function ProductFormPage({ mode }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items: categories } = useAppSelector((s: any) => s.categories);
  const products = useAppSelector((s: any) => s.products.items);

  const editing = useMemo(()=> products.find((p: any) => p.id===Number(id)), [products, id]);

  const [name, setName] = useState(editing?.name ?? '');
  const [description, setDescription] = useState(editing?.description ?? '');
  const [price, setPrice] = useState(editing?.price ?? '0.00');
  const [stock, setStock] = useState(editing?.stock ?? 0);
  const [categoryId, setCategoryId] = useState<number | ''>(editing?.category?.id ?? '');

  useEffect(()=> {
    dispatch(fetchCategories());
    if (mode==='edit' && !editing) dispatch(fetchProducts());
  }, [dispatch, mode, editing]);

  useEffect(()=> {
    if (editing && mode==='edit') {
      setName(editing.name);
      setDescription(editing.description ?? '');
      setPrice(editing.price);
      setStock(editing.stock);
      setCategoryId(editing.category?.id ?? '');
    }
  }, [editing, mode]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = { name, description, price, stock };
    if (categoryId === '') payload.categoryId = null;
    else payload.categoryId = Number(categoryId);

    if (mode==='create') {
      await dispatch(createProduct(payload)).unwrap();
    } else {
      await dispatch(updateProduct({ id: Number(id), body: payload })).unwrap();
    }
    navigate('/products');
  };

  return (
    <section className="max-w-2xl mx-auto">
      <div className="card space-y-4">
        <h2 className="text-lg font-semibold">{mode==='create' ? 'เพิ่มสินค้า' : `แก้ไขสินค้า #${id}`}</h2>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">ชื่อสินค้า</label>
            <input className="input" value={name} onChange={e=>setName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">รายละเอียด</label>
            <textarea className="input" value={description} onChange={e=>setDescription(e.target.value)} rows={3} />
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm mb-1">ราคา</label>
              <input className="input" type="number" step="0.01" value={price} onChange={e=>setPrice(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm mb-1">สต็อก</label>
              <input className="input" type="number" value={stock} onChange={e=>setStock(Number(e.target.value))} min={0} required />
            </div>
            <div>
              <label className="block text-sm mb-1">หมวดหมู่</label>
              <select className="select" value={categoryId} onChange={e=> setCategoryId(e.target.value==='' ? '' : Number(e.target.value))}>
                <option value="">-- ไม่ระบุ --</option>
                {categories.map((c: { id: number; name: string }) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="btn btn-primary" type="submit">{mode==='create' ? 'บันทึก' : 'อัปเดต'}</button>
            <button className="btn btn-outline" type="button" onClick={()=>history.back()}>ยกเลิก</button>
          </div>
        </form>
      </div>
    </section>
  );
}
