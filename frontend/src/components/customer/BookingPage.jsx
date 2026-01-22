import React, { useState } from 'react';
import axios from 'axios';

const BookingPage = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '', // Thêm email cho giống mẫu
    phone: '',
    guestCount: 2,
    branch: 'Chi nhánh 1', // Giả lập chọn chi nhánh
    reservationDate: '',
    reservationTime: '',
    note: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Gộp ngày và giờ thành định dạng DateTime chuẩn để gửi xuống Backend
    const fullDateTime = `${formData.reservationDate}T${formData.reservationTime}`;

    const dataToSend = {
      customerName: formData.customerName,
      phone: formData.phone,
      guestCount: formData.guestCount,
      reservationTime: fullDateTime,
      // Các trường email, branch, note có thể gửi nếu Backend đã hỗ trợ, 
      // hiện tại ta gửi các trường cơ bản trước.
    };

    axios.post('/api/reservations', dataToSend)
      .then(() => {
        alert("🎉 Đặt bàn thành công! Chúng tôi sẽ liên hệ xác nhận sớm.");
        setFormData({ ...formData, customerName: '', phone: '', note: '' });
      })
      .catch(() => alert("Lỗi đặt bàn. Vui lòng thử lại!"));
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans">
      
      {/* --- CỘT TRÁI: HÌNH ẢNH (COLLAGE) --- */}
      <div className="lg:w-1/2 bg-gray-900 relative hidden lg:block overflow-hidden">
        {/* Lớp phủ màu tối để ảnh trông sang hơn */}
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        
        {/* Grid hình ảnh */}
        <div className="grid grid-cols-2 gap-2 h-full p-2">
          <div className="row-span-2 h-full">
            <img 
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop" 
              className="w-full h-full object-cover rounded-tl-xl rounded-bl-xl hover:scale-105 transition duration-700"
              alt="Interior 1"
            />
          </div>
          <div className="h-full">
            <img 
              src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000&auto=format&fit=crop" 
              className="w-full h-full object-cover rounded-tr-xl hover:scale-105 transition duration-700"
              alt="Interior 2"
            />
          </div>
          <div className="h-full">
            <img 
              src="https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?q=80&w=1000&auto=format&fit=crop" 
              className="w-full h-full object-cover rounded-br-xl hover:scale-105 transition duration-700"
              alt="Interior 3"
            />
          </div>
        </div>

        {/* Logo hoặc Slogan chìm */}
        <div className="absolute bottom-10 left-10 z-20 text-white">
          <h2 className="text-4xl font-extrabold tracking-widest uppercase">Food Paradise</h2>
          <p className="text-gray-300 mt-2">Trải nghiệm ẩm thực đỉnh cao</p>
        </div>
      </div>

      {/* --- CỘT PHẢI: FORM ĐẶT BÀN --- */}
      <div className="lg:w-1/2 bg-[#1a1a1a] flex items-center justify-center p-6 lg:p-12">
        
        {/* Card Form (Màu kem nhạt giống hình mẫu) */}
        <div className="bg-[#fdfbf7] w-full max-w-xl p-8 rounded-xl shadow-2xl relative">
          
          {/* Trang trí góc (Optional) */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-orange-600 w-20 h-1 rounded-full"></div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center uppercase tracking-wide">
            Booking / Đặt Bàn
          </h2>
          
          <p className="text-red-500 text-xs italic mb-6 text-center">
            *LƯU Ý: Sau khi đăng ký, chúng tôi sẽ liên hệ Quý khách trong vòng 24H để xác nhận.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Hàng 1: Tên & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Họ Tên / Full Name</label>
                <input 
                  required name="customerName"
                  type="text" 
                  className="w-full bg-gray-100 border-b-2 border-gray-300 focus:border-orange-500 px-3 py-2 outline-none transition-colors"
                  placeholder="Nguyễn Văn A"
                  value={formData.customerName} onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                <input 
                  name="email"
                  type="email" 
                  className="w-full bg-gray-100 border-b-2 border-gray-300 focus:border-orange-500 px-3 py-2 outline-none transition-colors"
                  placeholder="example@gmail.com"
                  value={formData.email} onChange={handleChange}
                />
              </div>
            </div>

            {/* Hàng 2: SĐT & Số khách */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Số Điện Thoại / Phone</label>
                <input 
                  required name="phone"
                  type="tel" 
                  className="w-full bg-gray-100 border-b-2 border-gray-300 focus:border-orange-500 px-3 py-2 outline-none transition-colors"
                  placeholder="0909..."
                  value={formData.phone} onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Số Khách / Guests</label>
                <input 
                  required name="guestCount"
                  type="number" min="1"
                  className="w-full bg-gray-100 border-b-2 border-gray-300 focus:border-orange-500 px-3 py-2 outline-none transition-colors"
                  value={formData.guestCount} onChange={handleChange}
                />
              </div>
            </div>

            {/* Hàng 3: Chọn Nhà hàng (Giả lập) */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nhà Hàng / Restaurant</label>
              <select className="w-full bg-gray-100 border-b-2 border-gray-300 focus:border-orange-500 px-3 py-2 outline-none cursor-pointer">
                <option>Food Paradise - Ẩm thực Á Âu</option>
              </select>
            </div>

            {/* Hàng 4: Chọn Chi nhánh */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Chi Nhánh / Branch</label>
              <select 
                name="branch"
                className="w-full bg-gray-100 border-b-2 border-gray-300 focus:border-orange-500 px-3 py-2 outline-none cursor-pointer"
                value={formData.branch} onChange={handleChange}
              >
                <option value="Chi nhánh 1">Chi nhánh 1 - Quận 1, TP.HCM</option>
                <option value="Chi nhánh 2">Chi nhánh 2 - Quận 7, TP.HCM</option>
              </select>
            </div>

            {/* Hàng 5: Ngày & Giờ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ngày / Date</label>
                <input 
                  required name="reservationDate"
                  type="date" 
                  className="w-full bg-gray-100 border-b-2 border-gray-300 focus:border-orange-500 px-3 py-2 outline-none"
                  value={formData.reservationDate} onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Giờ / Time</label>
                <input 
                  required name="reservationTime"
                  type="time" 
                  className="w-full bg-gray-100 border-b-2 border-gray-300 focus:border-orange-500 px-3 py-2 outline-none"
                  value={formData.reservationTime} onChange={handleChange}
                />
              </div>
            </div>

            {/* Hàng 6: Ghi chú */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Yêu Cầu Đặc Biệt / Special Request</label>
              <textarea 
                name="note"
                rows="3"
                className="w-full bg-gray-100 border-b-2 border-gray-300 focus:border-orange-500 px-3 py-2 outline-none resize-none"
                placeholder="Ví dụ: Bàn gần cửa sổ, dị ứng hải sản..."
                value={formData.note} onChange={handleChange}
              ></textarea>
            </div>

            {/* Checkbox xác nhận */}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="confirm" className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500" />
              <label htmlFor="confirm" className="text-xs text-gray-600">
                Tôi muốn nhận xác nhận đặt bàn qua email / I want to confirm via email
              </label>
            </div>

            {/* Nút Submit */}
            <button 
              type="submit" 
              className="w-full bg-gray-800 text-white font-bold py-4 rounded hover:bg-gray-700 transition duration-300 uppercase tracking-wider shadow-lg"
            >
              Booking / Đặt Bàn
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;