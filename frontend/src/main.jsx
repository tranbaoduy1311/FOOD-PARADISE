import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios';

// --- CẤU HÌNH KẾT NỐI ---
// Link Backend trên Render của bạn
const RENDER_URL = "https://pos-backend-api-fs6z.onrender.com"; 

// Tự động chọn: Nếu chạy trên mạng (Vercel) thì dùng Render, chạy ở máy thì dùng Localhost
axios.defaults.baseURL = import.meta.env.PROD ? RENDER_URL : "http://localhost:8080";
// ------------------------

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Nếu trong App.jsx đã có BrowserRouter thì ở đây không cần bọc nữa */}
    <App />
  </React.StrictMode>,
)