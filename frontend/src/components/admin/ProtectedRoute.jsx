import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const userData = localStorage.getItem('adminUser');

  if (!userData) {
    return <Navigate to="/admin/login" replace />;
  }

  // Chuyển chuỗi string từ localStorage thành Object
  const user = JSON.parse(userData);

  // KIỂM TRA THÊM: Nếu không phải ADMIN thì đá văng ra trang login
  if (user.role !== 'ADMIN' && user.role !== 'admin') {
    alert("Bạn không có quyền truy cập khu vực này!");
    localStorage.removeItem('adminUser'); // Xóa luôn dữ liệu sai này đi
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;