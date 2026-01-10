import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MenuPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState("");

  // --- API CALLS ---
  useEffect(() => {
    axios.get('http://localhost:8080/api/products').then(res => setProducts(res.data));
    axios.get('http://localhost:8080/api/categories').then(res => setCategories(res.data));
  }, []);

  // --- FILTER LOGIC ---
  const filteredProducts = products.filter(product => {
    const matchCategory = activeCategory === 'ALL' || product.category?.id === activeCategory;
    const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      
      {/* --- 1. HERO BANNER (Parallax Effect) --- */}
      <div className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1920&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-black/60"></div> {/* Lớp phủ tối */}
        
        <div className="relative z-10 text-center text-white px-4 animate-fade-in-up">
          <span className="text-orange-400 font-bold tracking-widest uppercase text-sm mb-2 block">Khám phá ẩm thực</span>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg">
            Thực Đơn Hảo Hạng
          </h1>
          <p className="text-gray-200 text-lg max-w-2xl mx-auto">
            Sự kết hợp tinh tế giữa nguyên liệu tươi ngon và nghệ thuật chế biến đỉnh cao.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        
        {/* --- 2. THANH TÌM KIẾM & DANH MỤC (Nổi lên trên) --- */}
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 flex flex-col md:flex-row gap-6 items-center justify-between border border-gray-100">
          
          {/* Bộ lọc danh mục */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            <button 
              onClick={() => setActiveCategory('ALL')}
              className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap transition-all duration-300 ${
                activeCategory === 'ALL' 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-200 scale-105' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tất cả
            </button>
            
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap transition-all duration-300 ${
                  activeCategory === cat.id 
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-200 scale-105' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Ô tìm kiếm */}
          <div className="relative w-full md:w-80 group">
            <input 
              type="text" 
              placeholder="Bạn muốn ăn gì hôm nay?..." 
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-orange-500 transition-colors text-lg">🔍</span>
          </div>
        </div>

        {/* --- 3. DANH SÁCH MÓN ĂN (GRID) --- */}
        <div className="mt-12">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
{filteredProducts.map((product) => (            
      <div 
                  key={product.id} 
                  className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden flex flex-col h-full hover:-translate-y-2"
                >
                  {/* Hình ảnh */}
                  <div className="h-64 overflow-hidden relative">
                    <img 
                      src={product.image || "https://via.placeholder.com/300"} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Badge (Giả lập logic: Món giá > 100k là Best Seller) */}
                    {product.price > 100000 && (
                      <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
                        BEST SELLER
                      </div>
                    )}

                    {/* Nút Quick View (Hiện khi hover) */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                       <Link to="/booking" className="bg-white text-gray-900 font-bold px-6 py-2 rounded-full shadow-lg hover:bg-orange-600 hover:text-white transition transform scale-90 group-hover:scale-100">
                          Đặt bàn ngay
                       </Link>
                    </div>
                  </div>

                  {/* Thông tin */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-xs font-bold text-orange-500 uppercase tracking-wide">
                        {product.category ? product.category.name : "Món ngon"}
                      </div>
                      <div className="flex text-yellow-400 text-xs">
                        ★★★★★
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
                      {product.name}
                    </h3>
                    
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
                      Hương vị đậm đà, nguyên liệu tươi ngon, chế biến công phu bởi đầu bếp 5 sao.
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <span className="text-2xl font-extrabold text-gray-900">
                        {product.price.toLocaleString()} <span className="text-sm text-gray-500 font-normal">đ</span>
                      </span>
                      <button className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-orange-600 hover:text-white transition-colors shadow-sm">
                        ❤️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
              <div className="text-6xl mb-4 opacity-50">🥗</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Không tìm thấy món ăn</h3>
              <p className="text-gray-500">Rất tiếc, chúng tôi không tìm thấy món nào phù hợp với từ khóa của bạn.</p>
              <button 
                onClick={() => {setSearchTerm(""); setActiveCategory("ALL")}}
                className="mt-6 text-orange-600 font-bold hover:underline"
              >
                Xem tất cả món ăn
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MenuPage;