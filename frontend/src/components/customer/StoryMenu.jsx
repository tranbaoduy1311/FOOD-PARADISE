import React from 'react';
import { Link } from 'react-router-dom';

const StoryMenu = () => {
  // Dữ liệu các món ăn trên đường dẫn
  const dishes = [
    {
      id: 1,
      name: "Nhà hàng Nhật - Sorae Sushi",
      img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=500&auto=format&fit=crop",
      top: "5%",
      left: "60%", // Lệch phải
      delay: "0s"
    },
    {
      id: 2,
      name: "Nhà hàng Quảng Đông - San Fu Lou",
      img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=500&auto=format&fit=crop",
      top: "30%",
      left: "20%", // Lệch trái
      delay: "1s"
    },
    {
      id: 3,
      name: "Nhà hàng Việt - Dì Mai",
      img: "https://images.unsplash.com/photo-1585937421612-70a008356f36?q=80&w=500&auto=format&fit=crop",
      top: "55%",
      left: "65%", // Lệch phải
      delay: "2s"
    },
    {
      id: 4,
      name: "Nhà hàng Âu - Sens Dine & Wine",
      img: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=500&auto=format&fit=crop",
      top: "80%",
      left: "35%", // Ở giữa
      delay: "3s"
    }
  ];

  return (
    <div className="bg-[#2b2b2b] min-h-[1000px] py-20 relative overflow-hidden font-sans text-white">
      
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row h-full">
        
        {/* --- PHẦN 1: GIỚI THIỆU (BÊN TRÁI) --- */}
        <div className="lg:w-1/3 pt-20 z-10">
          <h2 className="text-3xl font-bold mb-6 border-l-4 border-white pl-4">Giới thiệu</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-4 text-justify">
            D1-Concepts được công nhận là một trong số ít các thương hiệu uy tín và được yêu chuộng nhất tại Việt Nam trong ngành F&B. 
            Hoạt động với chức năng kinh doanh chính là phát triển hệ thống thực phẩm và dịch vụ ăn uống (F&B).
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-8 text-justify">
            D1-Concepts là nơi hội tụ niềm đam mê và sự sáng tạo trong ngành ẩm thực, sở hữu 4 thương hiệu đại diện cho các nền ẩm thực đa dạng và độc đáo trên thế giới như San Fu Lou – Quảng Đông, SORAE – Nhật Bản, Dì Mai – Việt Nam, SENS – Châu Âu.
          </p>
          
          <Link to="/menu" className="border border-white px-8 py-2 text-sm hover:bg-white hover:text-black transition duration-300 uppercase tracking-wider">
            Xem thêm
          </Link>
        </div>

        {/* --- PHẦN 2: ĐƯỜNG DẪN MÓN ĂN (BÊN PHẢI) --- */}
        <div className="lg:w-2/3 relative h-[900px] mt-10 lg:mt-0">
          
          {/* ĐƯỜNG CONG SVG (Vẽ đường nối) */}
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 600 900" preserveAspectRatio="none">
            {/* 
               M: Điểm bắt đầu
               C: Đường cong Bezier (Điều chỉnh độ uốn lượn)
            */}
            <path 
              d="M 400 50 
                 C 400 200, 150 200, 150 350 
                 C 150 500, 450 500, 450 650
                 C 450 800, 250 800, 250 900"
              fill="none" 
              stroke="white" 
              strokeWidth="2"
              strokeDasharray="10, 5" // Tạo nét đứt (nếu muốn nét liền thì xóa dòng này)
              className="opacity-50"
            />
          </svg>

          {/* CÁC MÓN ĂN (NODES) */}
          {dishes.map((dish) => (
            <div 
              key={dish.id}
              className="absolute flex flex-col items-center w-48 group cursor-pointer"
              style={{ top: dish.top, left: dish.left, transform: 'translate(-50%, -50%)' }}
            >
              {/* Hình ảnh đĩa tròn */}
              <div className="relative w-40 h-40 rounded-full border-4 border-gray-600 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:border-white animate-float">
                <img 
                  src={dish.img} 
                  alt={dish.name} 
                  className="w-full h-full object-cover"
                />
                {/* Hiệu ứng bóng sáng khi hover */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>

              {/* Tên nhà hàng */}
              <div className="mt-4 text-center">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-300 group-hover:text-white transition-colors">
                  {dish.name.split(' - ')[0]}
                </h3>
                <p className="text-lg font-bold text-white font-serif italic">
                  {dish.name.split(' - ')[1]}
                </p>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default StoryMenu;