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
      left: "60%", 
      delay: "0s"
    },
    {
      id: 2,
      name: "Nhà hàng Quảng Đông - San Fu Lou",
      img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=500&auto=format&fit=crop",
      top: "30%",
      left: "20%", 
      delay: "1s"
    },
    {
      id: 3,
      name: "Nhà hàng Việt - Dì Mai",
      img: "data:image/jpeg;base64,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",
      top: "55%",
      left: "65%", 
      delay: "2s"
    },
    {
      id: 4,
      name: "Nhà hàng Âu - Sens Dine & Wine",
      img: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=500&auto=format&fit=crop",
      top: "80%",
      left: "35%", 
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