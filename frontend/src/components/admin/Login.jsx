import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Gửi yêu cầu đăng nhập kèm mã code qua RequestParam
    axios.post(`/api/auth/login-pos?code=${code}`)
      .then(res => {
        // Nếu thành công (Backend trả về 200 OK)
        // Lưu thông tin Admin vào localStorage để ProtectedRoute kiểm tra
        localStorage.setItem('adminUser', JSON.stringify(res.data));
        
        // Chuyển hướng vào trang Dashboard
        navigate('/admin/dashboard');
      })
      .catch(err => {
        // Nếu thất bại (Backend trả về 401 hoặc 403)
        // Lấy tin nhắn lỗi cụ thể từ Backend gửi về
        const errorMsg = err.response?.data || "Mã nhân viên không hợp lệ hoặc lỗi kết nối!";
        alert(errorMsg);
      });
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white p-10 rounded-[30px] shadow-2xl w-96 text-center animate-bounce-in">
        <div className="text-5xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold mb-2 text-gray-800 tracking-tight">POS ADMIN</h2>
        <p className="text-gray-500 mb-8 text-sm">Vui lòng nhập mã nhân viên để tiếp tục</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <input 
            required
            type="password" 
            placeholder="Nhập mã PIN / Mã nhân viên" 
            className="w-full p-4 border-2 border-gray-100 rounded-2xl text-center text-2xl tracking-widest focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
            value={code}
            onChange={e => setCode(e.target.value)}
            autoFocus
          />
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-all"
          >
            XÁC NHẬN ĐĂNG NHẬP
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-50">
           <p className="text-xs text-gray-400 italic">Chỉ dành cho nhân viên quản lý (ADMIN)</p>
        </div>
      </div>
    </div>
  );
};

export default Login;