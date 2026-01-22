import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalTables: 0,
    revenue: 0,
    totalOrders: 0,
    chartData: []
  });

  // State cho Modal danh sách đơn hàng (Cấp 1)
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [todayOrders, setTodayOrders] = useState([]);

  // State cho Modal chi tiết món ăn (Cấp 2)
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    axios.get('/api/dashboard/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error(err));
  }, []);

  // 1. Hàm mở danh sách đơn hàng hôm nay
  const handleShowRevenueDetails = () => {
    axios.get('/api/dashboard/orders/today')
      .then(res => {
        setTodayOrders(res.data);
        setShowRevenueModal(true);
      })
      .catch(err => {
        console.error(err);
        alert("Lỗi tải chi tiết doanh thu!");
      });
  };

  // 2. Hàm xem chi tiết món ăn của 1 đơn (Khi bấm vào dòng đơn hàng)
  const handleViewOrderItems = (orderId) => {
    axios.get(`/api/orders/${orderId}/details`)
      .then(res => {
        setSelectedOrderDetails(res.data);
        setSelectedOrderId(orderId);
        setShowDetailModal(true); // Mở Modal cấp 2
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* --- BANNER --- */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl h-64">
        <img 
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop" 
          alt="Restaurant Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-transparent flex items-center px-10">
          <div className="text-white max-w-xl">
            <h1 className="text-4xl font-extrabold mb-2">Xin chào, Admin! 👋</h1>
            <p className="text-lg text-gray-200 mb-6">
              Hệ thống quản lý nhà hàng đang hoạt động. Kiểm tra doanh thu ngay bên dưới.
            </p>
            <Link to="/pos" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg inline-flex items-center gap-2">
              🚀 Vào trang bán hàng
            </Link>
          </div>
        </div>
      </div>

      {/* --- THẺ THỐNG KÊ --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div onClick={handleShowRevenueDetails} className="cursor-pointer transform transition hover:scale-105">
          <StatCard 
            icon="💰" color="blue" 
            title="Doanh thu hôm nay (Xem chi tiết)" 
            value={`${stats.revenue.toLocaleString()} đ`} 
          />
        </div>
        <StatCard icon="🧾" color="green" title="Tổng đơn hàng" value={stats.totalOrders} />
        <StatCard icon="🍔" color="yellow" title="Tổng món ăn" value={stats.totalProducts} />
        <StatCard icon="🪑" color="purple" title="Tổng bàn ăn" value={`${stats.totalTables} bàn`} />
      </div>

      {/* --- BIỂU ĐỒ --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="admin-card lg:col-span-2 min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 text-xl">📈 Biểu đồ doanh thu 7 ngày qua</h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                <Tooltip 
                  cursor={{fill: '#F3F4F6'}}
                  formatter={(value) => new Intl.NumberFormat('vi-VN').format(value) + ' đ'}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="revenue" fill="#3B82F6" radius={[6, 6, 0, 0]} barSize={50} name="Doanh thu" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="admin-card">
            <h3 className="font-bold text-gray-800 text-lg mb-4">⚡ Truy cập nhanh</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/admin/products" className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition text-center group"><div className="text-3xl mb-2">🍔</div><div className="text-sm font-bold text-blue-700">Thêm món</div></Link>
              <Link to="/admin/tables" className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition text-center group"><div className="text-3xl mb-2">🪑</div><div className="text-sm font-bold text-purple-700">Sơ đồ bàn</div></Link>
              <Link to="/admin/employees" className="p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition text-center group"><div className="text-3xl mb-2">👥</div><div className="text-sm font-bold text-orange-700">Nhân sự</div></Link>
              <Link to="/admin/inventory" className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition text-center group"><div className="text-3xl mb-2">📦</div><div className="text-sm font-bold text-green-700">Kho hàng</div></Link>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL 1: DANH SÁCH ĐƠN HÀNG --- */}
      {showRevenueModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 backdrop-blur-sm">
          <div className="bg-white w-[800px] max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-bounce-in">
            <div className="bg-blue-600 text-white p-5 flex justify-between items-center">
              <h3 className="text-xl font-bold">📋 Doanh thu hôm nay</h3>
              <button onClick={() => setShowRevenueModal(false)} className="text-white hover:text-gray-200 text-2xl">✖</button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                    <th className="py-3 px-4">Mã đơn</th>
                    <th className="py-3 px-4">Thời gian</th>
                    <th className="py-3 px-4">Bàn</th>
                    <th className="py-3 px-4 text-right">Tổng tiền</th>
                    <th className="py-3 px-4 text-center">Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {todayOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 hover:bg-blue-50 transition">
                      <td className="py-3 px-4 font-bold text-blue-600">#{order.id}</td>
                      <td className="py-3 px-4">{new Date(order.createdAt).toLocaleTimeString()}</td>
                      <td className="py-3 px-4 font-bold">{order.tableId ? `Bàn ${order.tableId}` : 'Mang về'}</td>
                      <td className="py-3 px-4 text-right font-bold text-red-600">{order.totalPrice.toLocaleString()} đ</td>
                      <td className="py-3 px-4 text-center">
                        <button 
                          onClick={() => handleViewOrderItems(order.id)}
                          className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold hover:bg-blue-200"
                        >
                          Xem món
                        </button>
                      </td>
                    </tr>
                  ))}
                  {todayOrders.length === 0 && <tr><td colSpan="5" className="text-center py-6 text-gray-400">Chưa có đơn hàng nào.</td></tr>}
                </tbody>
              </table>
            </div>
            <div className="p-5 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
              <span className="text-gray-500 font-bold">Tổng số đơn: {todayOrders.length}</span>
              <div className="text-xl font-extrabold text-blue-800">Tổng cộng: {todayOrders.reduce((sum, o) => sum + o.totalPrice, 0).toLocaleString()} đ</div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: CHI TIẾT MÓN ĂN (Hiện đè lên Modal 1) --- */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white w-[500px] rounded-xl shadow-2xl overflow-hidden animate-bounce-in">
            <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold">Chi tiết đơn hàng #{selectedOrderId}</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-white hover:text-gray-300">✖</button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Tên món</th>
                    <th className="text-center py-2">SL</th>
                    <th className="text-right py-2">Đơn giá</th>
                    <th className="text-right py-2">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrderDetails.map((item, idx) => (
                    <tr key={idx} className="border-b border-dashed">
                      <td className="py-2">
                        <div className="font-bold text-gray-800">{item.productName}</div>
                        {item.note && <div className="text-xs text-red-500 italic">Note: {item.note}</div>}
                      </td>
                      <td className="text-center py-2">x{item.quantity}</td>
                      <td className="text-right py-2 text-gray-500">{item.price.toLocaleString()}</td>
                      <td className="text-right py-2 font-bold">{(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-gray-50 text-right">
              <button onClick={() => setShowDetailModal(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded font-bold">Đóng</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const StatCard = ({ icon, color, title, value }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 border-blue-500",
    green: "bg-green-100 text-green-600 border-green-500",
    yellow: "bg-yellow-100 text-yellow-600 border-yellow-500",
    purple: "bg-purple-100 text-purple-600 border-purple-500",
  };
  return (
    <div className={`admin-card flex items-center p-5 border-l-4 ${colorClasses[color].split(' ')[2]} transition duration-300`}>
      <div className={`p-4 rounded-full mr-5 ${colorClasses[color].split(' ').slice(0, 2).join(' ')}`}><span className="text-2xl">{icon}</span></div>
      <div><p className="text-gray-500 text-sm font-bold uppercase tracking-wide">{title}</p><p className="text-2xl font-extrabold text-gray-800 mt-1">{value}</p></div>
    </div>
  );
};

export default Dashboard;