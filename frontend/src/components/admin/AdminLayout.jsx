import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/admin.css';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Lấy thông tin nhân viên đang đăng nhập từ localStorage
  const adminData = JSON.parse(localStorage.getItem('adminUser') || '{}');

  // Hàm xử lý Đăng xuất
  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?")) {
      localStorage.removeItem('adminUser'); // Xóa dữ liệu phiên làm việc
      navigate('/admin/login'); // Chuyển về trang đăng nhập
    }
  };

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

          <Link to="/admin/promotions" className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/promotions')}`}>
            <span className="mr-3">🎟️</span> Khuyến Mãi
          </Link>

          <Link to="/admin/payroll" className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/payroll')}`}>
            <span className="mr-3">💰</span> Quản lý Lương
          </Link>

          <Link to="/admin/suppliers" className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/suppliers')}`}>
            <span className="mr-3">🏭</span> Nhà cung cấp
          </Link>

          <Link to="/admin/contacts" className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${isActive('/contacts')}`}>
            <span className="mr-3">✉️</span> Phản hồi khách
          </Link>
        </nav>

        {/* --- FOOTER SIDEBAR --- */}
        <div className="p-4 border-t border-gray-700 space-y-2">
          {/* NÚT ĐĂNG XUẤT Ở SIDEBAR */}
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center w-full py-3 px-4 bg-red-900/30 hover:bg-red-600 text-red-400 hover:text-white rounded-xl transition text-sm font-bold border border-red-900/50"
          >
            🚪 Đăng xuất
          </button>

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
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800">{adminData.name || 'Quản trị viên'}</p>
                <p className="text-[10px] text-blue-600 font-bold uppercase">{adminData.position || 'Admin'}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold shadow-md">
                {adminData.name ? adminData.name.charAt(0).toUpperCase() : 'A'}
              </div>
            </div>

            {/* NÚT ĐĂNG XUẤT NHANH Ở HEADER */}
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-colors"
              title="Đăng xuất"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
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