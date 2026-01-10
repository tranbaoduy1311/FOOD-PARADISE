import React from 'react';
import { Link } from 'react-router-dom';
import StoryMenu from './StoryMenu'; // Giữ nguyên component này của bạn

const HomePage = () => {
  // Danh sách món nổi bật (Dữ liệu giả lập)
  const featuredDishes = [
    { id: 1, name: "Bò Beefsteak Thượng Hạng", price: "189.000", img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800&auto=format&fit=crop", tag: "Best Seller" },
    { id: 2, name: "Mỳ Ý Sốt Kem Nấm", price: "120.000", img: "https://images.unsplash.com/photo-1551183053-bf91b1d511a3?q=80&w=800&auto=format&fit=crop", tag: "Mới" },
    { id: 3, name: "Salad Cá Ngừ Tươi", price: "85.000", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop", tag: "Healthy" },
    { id: 4, name: "Pizza Hải Sản Nhiệt Đới", price: "250.000", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop", tag: "Hot" },
  ];

  return (
    <div className="font-sans overflow-x-hidden">
      
      {/* --- 1. HERO BANNER (PARALLAX & GLASSMORPHISM) --- */}
      <div className="relative h-[85vh] flex items-center justify-center bg-fixed bg-center bg-cover" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1920&auto=format&fit=crop')" }}>
        
        {/* Lớp phủ tối màu gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-gray-900"></div>

        <div className="relative z-10 text-center px-4 max-w-5xl">
          <div className="inline-block mb-4 px-4 py-1 border border-orange-400 rounded-full bg-black/30 backdrop-blur-sm animate-fade-in-down">
            <span className="text-orange-400 font-bold tracking-widest uppercase text-xs md:text-sm">
              ✨ Trải nghiệm ẩm thực 5 sao
            </span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-extrabold mb-6 leading-tight text-white drop-shadow-2xl animate-fade-in-up">
            Đánh Thức <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
              Vị Giác Của Bạn
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-200 mb-10 font-light max-w-3xl mx-auto animate-fade-in-up delay-100">
            Nơi hội tụ tinh hoa ẩm thực Á - Âu trong không gian sang trọng và ấm cúng.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center animate-fade-in-up delay-200">
            <Link to="/booking" className="group relative px-8 py-4 bg-orange-600 rounded-full text-white font-bold text-lg overflow-hidden shadow-lg hover:shadow-orange-500/50 transition-all duration-300">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-orange-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative flex items-center gap-2">
                ĐẶT BÀN NGAY <span className="group-hover:translate-x-1 transition-transform">➜</span>
              </span>
            </Link>
            <Link to="/menu" className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-full text-white font-bold text-lg hover:bg-white hover:text-orange-600 transition-all duration-300">
              XEM THỰC ĐƠN
            </Link>
          </div>
        </div>

        {/* Icon cuộn xuống */}
        <div className="absolute bottom-10 animate-bounce text-white/50">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        </div>
      </div>

      {/* --- STORY MENU (Giữ nguyên của bạn) --- */}
      <div className="-mt-10 relative z-20 mb-10">
         <StoryMenu />
      </div>

      {/* --- 2. GIỚI THIỆU (CARDS NỔI) --- */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Tại Sao Chọn Food Paradise?</h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-orange-400 to-red-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🥦", title: "Nguyên Liệu Tươi Sạch", desc: "100% thực phẩm organic nhập khẩu trong ngày." },
              { icon: "👨‍🍳", title: "Đầu Bếp 5 Sao", desc: "Đội ngũ bếp trưởng với hơn 15 năm kinh nghiệm." },
              { icon: "🥂", title: "Không Gian Sang Trọng", desc: "Thiết kế hiện đại, phù hợp hẹn hò & tiệc tùng." }
            ].map((item, index) => (
              <div key={index} className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-center">
                <div className="w-20 h-20 mx-auto bg-orange-50 rounded-full flex items-center justify-center text-4xl mb-6 group-hover:scale-110 group-hover:bg-orange-100 transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-orange-600 transition-colors">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- 3. MÓN NGON NỔI BẬT (DARK THEME) --- */}
      <div className="py-24 bg-gray-900 text-white relative overflow-hidden">
        {/* Họa tiết nền mờ */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="text-orange-500 font-bold uppercase tracking-wider text-sm">Khám phá hương vị</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-2">Món Ngon Nổi Bật 🔥</h2>
            </div>
            <Link to="/menu" className="group flex items-center gap-2 text-orange-400 hover:text-white transition-colors">
              Xem toàn bộ thực đơn <span className="group-hover:translate-x-2 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredDishes.map((dish) => (
              <div key={dish.id} className="group bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-orange-500/20 transition-all duration-500 hover:-translate-y-2">
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={dish.img} 
                    alt={dish.name} 
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    {dish.tag}
                  </div>
                  {/* Nút thêm nhanh */}
                  <button className="absolute bottom-3 right-3 bg-white text-orange-600 p-3 rounded-full shadow-lg translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-orange-600 hover:text-white">
                    🛒
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold mb-2 truncate group-hover:text-orange-400 transition-colors">{dish.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">
                      {dish.price} đ
                    </span>
                    <div className="flex text-yellow-400 text-xs">★★★★★</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- 4. PROMO SECTION (ẢNH LỚN) --- */}
      <div className="py-20 bg-gradient-to-r from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2 relative">
            <div className="absolute -top-4 -left-4 w-full h-full border-4 border-orange-200 rounded-3xl transform -rotate-2"></div>
            <img 
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000&auto=format&fit=crop" 
              alt="Chef" 
              className="relative rounded-3xl shadow-2xl w-full object-cover transform rotate-2 hover:rotate-0 transition duration-500"
            />
          </div>
          <div className="w-full md:w-1/2 space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
              Ưu Đãi Đặc Biệt <br/> 
              <span className="text-orange-600">Giảm 20%</span> Khi Đặt Bàn Online
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Đừng bỏ lỡ cơ hội thưởng thức những món ăn tuyệt hảo với mức giá ưu đãi. 
              Chương trình áp dụng cho tất cả khách hàng đặt bàn qua website trong tháng này.
            </p>
            
            <div className="space-y-4">
              {["Tặng kèm tráng miệng miễn phí", "Không gian riêng tư cho tiệc sinh nhật", "Hỗ trợ trang trí theo yêu cầu"].map((text, i) => (
                <div key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <span className="text-green-500 text-xl">✅</span>
                  <span className="font-medium text-gray-700">{text}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link to="/booking" className="inline-block bg-gray-900 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-orange-600 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                Nhận Ưu Đãi Ngay
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomePage;