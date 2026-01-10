import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import '../../styles/admin.css';

const AdminLayout = () => {
  const location = useLocation();

  // Hàm kiểm tra link nào đang active để tô màu
  const isActive = (path) => {
    return location.pathname.includes(path) 
      ? "bg-blue-600 text-white shadow-lg" 
      : "text-gray-300 hover:bg-gray-800 hover:text-white";
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* --- SIDEBAR --- */}
      <div className="w-64 bg-gray-900 text-white flex flex-col shadow-2xl transition-all duration-300">
        <div className="h-20 flex items-center justify-center border-b border-gray-700">
          <h1 className="text-2xl font-extrabold tracking-wider text-blue-400">POS ADMIN</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-3 mt-4 overflow-y-auto">
          {/* --- PHẦN 1: QUẢN LÝ CHUNG --- */}
          <p className="text-xs text-gray-500 uppercase font-bold mb-2 px-4">Quản lý chung</p>
          
          <Link to="/admin/dashboard" className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/dashboard')}`}>
            <span className="mr-3">📊</span> Tổng quan
          </Link>
          
          <Link to="/admin/products" className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/products')}`}>
            <span className="mr-3">🍔</span> Món ăn
          </Link>
          
          <Link to="/admin/categories" className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/categories')}`}>
            <span className="mr-3">📂</span> Danh mục
          </Link>
          
          <Link to="/admin/tables" className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/tables')}`}>
            <span className="mr-3">🪑</span> Bàn ăn
          </Link>

          {/* --- PHẦN 2: NỘI BỘ (Đã bỏ Bếp) --- */}
          <p className="text-xs text-gray-500 uppercase font-bold mb-2 px-4 mt-4">Nội bộ</p>

          <Link to="/admin/employees" className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/employees')}`}>
            <span className="mr-3">👥</span> Nhân sự
          </Link>

          <Link to="/admin/inventory" className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/inventory')}`}>
            <span className="mr-3">📦</span> Kho hàng
          </Link>
          <Link to="/admin/timekeeping" className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/timekeeping')}`}>
  <span className="mr-3">⏰</span> Chấm công
</Link>

    
<Link to="/admin/audit-logs" className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/audit-logs')}`}>
  <span className="mr-3">🛡️</span> Nhật ký & Bảo mật
</Link>

<Link to="/admin/promotions" className="flex items-center p-2 hover:bg-gray-700 rounded">
  <span>🎟️ Quản lý Khuyến Mãi</span>
</Link>

<Link 
  to="/admin/payroll" 
  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
>
  <span>💰</span> {/* Icon tiền */}
  <span className="font-medium">Quản lý Lương</span>
</Link>

<Link 
  to="/admin/suppliers" 
  className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
>
  <span>🏭</span> {/* Icon nhà máy */}
  <span className="font-medium">Nhà cung cấp</span>
</Link>

  
          
        </nav>

        {/* --- FOOTER SIDEBAR --- */}
        <div className="p-4 border-t border-gray-700">
          <Link to="/" className="flex items-center justify-center w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition text-sm font-bold text-gray-300">
            ⬅️ Về trang Bán Hàng
          </Link>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header nhỏ phía trên */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
          <h2 className="text-xl font-bold text-gray-700">Hệ thống quản trị</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Xin chào, Admin</span>
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">A</div>
          </div>
        </header>

        {/* Nội dung thay đổi */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;