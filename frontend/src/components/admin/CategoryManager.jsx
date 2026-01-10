import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  const fetchCategories = () => {
    axios.get('http://localhost:8080/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = () => {
    if (!newCategoryName.trim()) return alert("Tên danh mục không được để trống!");
    axios.post('http://localhost:8080/api/categories', { name: newCategoryName })
      .then(() => {
        setNewCategoryName("");
        fetchCategories();
      })
      .catch(() => alert("Lỗi khi thêm!"));
  };

  // Chức năng Sửa
  const handleUpdate = (id) => {
    if (!editName.trim()) return alert("Tên không được để trống!");
    axios.post('http://localhost:8080/api/categories', { id, name: editName }) // Spring Boot save() sẽ update nếu có ID
      .then(() => {
        setEditingId(null);
        fetchCategories();
      })
      .catch(() => alert("Lỗi khi cập nhật!"));
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa danh mục này?")) {
      axios.delete(`http://localhost:8080/api/categories/${id}`)
        .then(() => {
          alert("Đã xóa thành công!");
          fetchCategories();
        })
        .catch(err => {
          alert(err.response?.data || "Lỗi khi xóa danh mục!");
        });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="admin-title">Quản lý Danh mục</h1>
      <p className="admin-subtitle">Phân loại thực đơn của nhà hàng</p>

      {/* FORM THÊM NHANH */}
      <div className="admin-card mb-6 bg-blue-50 border-l-4 border-blue-500">
        <h3 className="font-bold text-blue-800 mb-4 flex items-center">
          <span className="mr-2">📂</span> Thêm danh mục mới
        </h3>
        <div className="flex gap-4">
          <input 
            type="text" 
            className="admin-input bg-white" 
            placeholder="Nhập tên danh mục (VD: Trà trái cây)..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button onClick={handleAdd} className="admin-btn admin-btn-create shadow-md">
            + Lưu lại
          </button>
        </div>
      </div>

      {/* DANH SÁCH */}
      <div className="admin-card p-0 overflow-hidden shadow-xl">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="w-20">ID</th>
              <th>Tên Danh Mục</th>
              <th className="text-center w-40">Số lượng món</th>
              <th className="text-center w-48">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                <td className="font-bold text-gray-400">#{cat.id}</td>
                <td>
                  {editingId === cat.id ? (
                    <input 
                      className="border-b-2 border-blue-500 outline-none px-2 py-1 w-full font-bold text-blue-600"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <span className="font-bold text-lg text-gray-800">{cat.name}</span>
                  )}
                </td>
                <td className="text-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${cat.productCount > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {cat.productCount} món
                  </span>
                </td>
                <td className="text-center">
                  <div className="flex gap-2 justify-center">
                    {editingId === cat.id ? (
                      <>
                        <button onClick={() => handleUpdate(cat.id)} className="text-green-600 font-bold hover:underline">Lưu</button>
                        <button onClick={() => setEditingId(null)} className="text-gray-500 font-bold hover:underline">Hủy</button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => { setEditingId(cat.id); setEditName(cat.name); }}
                          className="admin-btn admin-btn-edit scale-90"
                        >
                          ✏️ Sửa
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          className="admin-btn admin-btn-delete scale-90"
                        >
                          🗑️ Xóa
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryManager;