import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import ChatWidget from './ChatWidget'; // Tí nữa sẽ tạo cái này

const CustomerLayout = () => {
  return (
    <div className="font-sans text-gray-700">
      {/* --- HEADER --- */}
      <header className="bg-white shadow-md fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-3xl font-extrabold text-orange-600 flex items-center gap-2">
            🍽️ <span className="hidden md:block">FOOD PARADISE</span>
          </Link>

          {/* Menu */}
          <nav className="hidden md:flex gap-8 font-bold text-gray-600">
            <Link to="/" className="hover:text-orange-600 transition">Trang chủ</Link>
            <Link to="/menu" className="hover:text-orange-600 transition">Thực đơn</Link>
            <Link to="/booking" className="hover:text-orange-600 transition">Đặt bàn</Link>
            <Link to="/contact" className="hover:text-orange-600 transition">Liên hệ</Link>
          </nav>

          {/* Nút đặt bàn nhanh */}
          <Link to="/booking" className="bg-orange-600 text-white px-6 py-2 rounded-full font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-200">
            Đặt bàn ngay
          </Link>
        </div>
      </header>

      {/* --- NỘI DUNG CHÍNH --- */}
      <main className="pt-20 min-h-screen bg-gray-50">
        <Outlet />
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">FOOD PARADISE</h3>
            <p className="text-gray-400">Nơi tinh hoa ẩm thực hội tụ. Phục vụ tận tâm, món ăn ngon miệng.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Liên hệ</h3>
            <p className="text-gray-400">📍 123 Đường ABC, Quận 1, TP.HCM</p>
            <p className="text-gray-400">📞 0909.123.456</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Giờ mở cửa</h3>
            <p className="text-gray-400">Thứ 2 - Chủ Nhật</p>
            <p className="text-gray-400">07:00 - 22:00</p>
          </div>
        </div>
        <div className="text-center mt-10 pt-4 border-t border-gray-800 text-gray-500">
          © 2024 Food Paradise. All rights reserved.
        </div>
      </footer>

      {/* --- CHAT WIDGET (Nút chat góc màn hình) --- */}
      <ChatWidget />
    </div>
  );
};

export default CustomerLayout;