// src/components/Navbar.tsx
import { Link } from 'react-router-dom';
import { Package, Home, PlusCircle, List } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <Package className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">ระบบจัดการสินค้า</h1>
              <p className="text-xs text-blue-100">Product Management</p>
            </div>
          </Link>

          {/* Menu */}
          <div className="flex gap-6">
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-500 transition"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">หน้าหลัก</span>
            </Link>
            <Link
              to="/products"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-500 transition"
            >
              <List className="w-5 h-5" />
              <span className="font-medium">รายการสินค้า</span>
            </Link>
            <Link
              to="/products/new"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-500 transition"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="font-medium">เพิ่มสินค้า</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;