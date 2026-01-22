import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeModal from './RecipeModal';
import ProductModal from './ProductModal'; // 1. Import Modal mới

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductForRecipe, setSelectedProductForRecipe] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false); // 2. State mở modal thêm

  const fetchProducts = () => {
    axios.get('/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = (id) => {
    if(window.confirm("Bạn có chắc muốn xóa món này không?")) {
      axios.delete(`/api/products/${id}`)
        .then(() => { alert("Đã xóa thành công!"); fetchProducts(); })
        .catch(() => alert("Lỗi khi xóa!"));
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div><h1 className="admin-title">Quản lý Món ăn</h1><p className="admin-subtitle">Quản lý danh sách thực đơn</p></div>
        
        {/* 3. Nút bấm mở Modal */}
        <button 
          onClick={() => setShowAddModal(true)}
          className="admin-btn admin-btn-create flex items-center"
        >
          <span className="text-xl mr-2">+</span> Thêm món mới
        </button>
      </div>

      {/* ... Phần tìm kiếm và bảng giữ nguyên ... */}
      <div className="admin-card mb-6 flex items-center py-4">
        <span className="text-2xl mr-3">🔍</span>
        <input type="text" placeholder="Tìm kiếm món ăn..." className="admin-input text-lg" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="admin-card p-0 overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th><th>Hình ảnh</th><th>Tên món</th><th>Giá bán</th><th className="text-center">Định lượng</th><th className="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id}>
                <td className="font-bold">#{p.id}</td>
                <td><img src={p.image || "https://via.placeholder.com/150"} alt={p.name} className="w-16 h-16 rounded-xl object-cover shadow-sm border" /></td>
                <td><span className="font-bold text-gray-800 text-base">{p.name}</span></td>
                <td><span className="admin-badge admin-badge-success">{p.price ? p.price.toLocaleString() : 0} đ</span></td>
                <td className="text-center">
                  <button onClick={() => setSelectedProductForRecipe(p)} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold hover:bg-purple-200 border border-purple-200">⚖️ Cấu hình</button>
                </td>
                <td className="text-center">
                  <div className="flex item-center justify-center gap-2">
                    <button className="admin-btn admin-btn-edit">✏️ Sửa</button>
                    <button onClick={() => handleDelete(p.id)} className="admin-btn admin-btn-delete">🗑️ Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. HIỂN THỊ MODAL THÊM MỚI */}
      {showAddModal && (
        <ProductModal 
          onClose={() => setShowAddModal(false)} 
          onSave={fetchProducts} 
        />
      )}

      {selectedProductForRecipe && (
        <RecipeModal 
          product={selectedProductForRecipe} 
          onClose={() => setSelectedProductForRecipe(null)} 
        />
      )}
    </div>
  );
};

export default ProductManager;