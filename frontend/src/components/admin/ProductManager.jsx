import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecipeModal from './RecipeModal';
import ProductModal from './ProductModal'; 

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductForRecipe, setSelectedProductForRecipe] = useState(null);
  
  // State quản lý Modal
  const [showAddModal, setShowAddModal] = useState(false); 
  const [editingProduct, setEditingProduct] = useState(null); // Lưu món ăn đang được chọn để sửa

  // Hàm lấy danh sách món ăn từ Backend
  const fetchProducts = () => {
    // Lưu ý: Nếu bạn đã sửa baseURL ở main.jsx thì chỉ cần gọi axios.get('/api/products')
    axios.get('http://localhost:8080/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error("Lỗi tải danh sách món ăn:", err));
  };

  useEffect(() => { 
    fetchProducts(); 
  }, []);

  // Hàm xóa món ăn
  const handleDelete = (id) => {
    if(window.confirm("Bạn có chắc muốn xóa món này không?")) {
      axios.delete(`http://localhost:8080/api/products/${id}`)
        .then(() => { 
          alert("Đã xóa thành công!"); 
          fetchProducts(); 
        })
        .catch(() => alert("Lỗi khi xóa! Món ăn này có thể đang nằm trong đơn hàng."));
    }
  };

  // Lọc món ăn theo ô tìm kiếm
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="admin-title">Quản lý Món ăn</h1>
          <p className="admin-subtitle">Quản lý danh sách thực đơn của nhà hàng</p>
        </div>
        
        <button 
          onClick={() => {
            setEditingProduct(null); // Đảm bảo không có dữ liệu cũ khi thêm mới
            setShowAddModal(true);
          }}
          className="admin-btn admin-btn-create flex items-center"
        >
          <span className="text-xl mr-2">+</span> Thêm món mới
        </button>
      </div>

      {/* THANH TÌM KIẾM */}
      <div className="admin-card mb-6 flex items-center py-4">
        <span className="text-2xl mr-3">🔍</span>
        <input 
          type="text" 
          placeholder="Tìm kiếm món ăn theo tên..." 
          className="admin-input text-lg" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
      </div>

      {/* BẢNG DANH SÁCH */}
      <div className="admin-card p-0 overflow-hidden shadow-xl">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Hình ảnh</th>
              <th>Tên món</th>
              <th>Giá bán</th>
              <th className="text-center">Định lượng</th>
              <th className="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="font-bold text-gray-400">#{p.id}</td>
                <td>
                  <img 
                    src={p.image || "https://via.placeholder.com/150"} 
                    alt={p.name} 
                    className="w-16 h-16 rounded-xl object-cover shadow-sm border" 
                  />
                </td>
                <td>
                  <span className="font-bold text-gray-800 text-base">{p.name}</span>
                  <div className="text-xs text-gray-400">{p.categoryName || 'Chưa phân loại'}</div>
                </td>
                <td>
                  <span className="admin-badge admin-badge-success">
                    {p.price ? p.price.toLocaleString() : 0} đ
                  </span>
                </td>
                <td className="text-center">
                  <button 
                    onClick={() => setSelectedProductForRecipe(p)} 
                    className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold hover:bg-purple-200 border border-purple-200 transition"
                  >
                    ⚖️ Cấu hình
                  </button>
                </td>
                <td className="text-center">
                  <div className="flex item-center justify-center gap-2">
                    {/* NÚT SỬA: Khi bấm sẽ lưu thông tin món ăn vào state editingProduct */}
                    <button 
                      onClick={() => setEditingProduct(p)}
                      className="admin-btn admin-btn-edit"
                    >
                      ✏️ Sửa
                    </button>
                    
                    <button 
                      onClick={() => handleDelete(p.id)} 
                      className="admin-btn admin-btn-delete"
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-400">Không tìm thấy món ăn nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL THÊM / SỬA MÓN ĂN */}
      {(showAddModal || editingProduct) && (
        <ProductModal 
          product={editingProduct} // Nếu là sửa thì truyền object p, nếu thêm mới thì truyền null
          onClose={() => {
            setShowAddModal(false);
            setEditingProduct(null);
          }} 
          onSave={() => {
            fetchProducts();
            setShowAddModal(false);
            setEditingProduct(null);
          }} 
        />
      )}

      {/* MODAL CẤU HÌNH CÔNG THỨC */}
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