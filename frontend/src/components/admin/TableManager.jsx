import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TableManager = () => {
  const [tables, setTables] = useState([]);
  const [newTableName, setNewTableName] = useState("");

  // Load danh sách bàn
  const fetchTables = () => {
    axios.get('/api/tables')
      .then(res => setTables(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchTables();
  }, []);

  // Thêm bàn mới
  const handleAddTable = () => {
    if (!newTableName) return alert("Vui lòng nhập tên bàn!");
    axios.post('/api/tables', { name: newTableName, status: "Trống" })
      .then(() => {
        setNewTableName("");
        fetchTables();
      })
      .catch(() => alert("Lỗi thêm bàn"));
  };

  // Xóa bàn
  const handleDelete = (id) => {
    if (window.confirm("Xóa bàn này?")) {
      axios.delete(`/api/tables/${id}`)
        .then(() => fetchTables());
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="admin-title mb-2">Quản lý Bàn ăn</h1>
      <p className="admin-subtitle">Sơ đồ bàn và trạng thái hoạt động</p>

      {/* Form thêm bàn nhanh */}
      <div className="admin-card mb-8 flex gap-4 items-center">
        <input 
          type="text" 
          className="admin-input w-64" 
          placeholder="Nhập tên bàn (VD: Bàn 10)..."
          value={newTableName}
          onChange={(e) => setNewTableName(e.target.value)}
        />
        <button onClick={handleAddTable} className="admin-btn admin-btn-create">
          + Thêm bàn
        </button>
      </div>

      {/* Sơ đồ bàn (Grid Layout) */}
      <div className="grid grid-cols-4 gap-6">
        {tables.map((table) => (
          <div key={table.id} className="admin-card relative hover:shadow-lg transition group">
            
            {/* Icon bàn ăn */}
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${
                table.status === 'Trống' ? 'bg-green-100 text-green-600' : 
                table.status === 'Có khách' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
              }`}>
                <span className="text-3xl">🪑</span>
              </div>
              
              {/* Nút xóa (chỉ hiện khi hover) */}
              <button 
                onClick={() => handleDelete(table.id)}
                className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
              >
                ✖
              </button>
            </div>

            <h3 className="text-xl font-bold text-gray-800">{table.name}</h3>
            
            {/* Trạng thái */}
            <div className="mt-2 flex items-center justify-between">
              <span className={`admin-badge ${
                table.status === 'Trống' ? 'admin-badge-success' : 'bg-red-100 text-red-700'
              }`}>
                {table.status}
              </span>
            </div>

            {/* Hành động giả lập (để test) */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
               {/* Nút này để test đổi trạng thái nhanh */}
               <button className="text-xs text-blue-500 hover:underline">Sửa trạng thái</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableManager;