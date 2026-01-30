import React, { useState } from 'react';
import axios from 'axios';

const BookingPage = () => {
  // --- Lấy ngày hiện tại định dạng YYYY-MM-DD để làm ngày tối thiểu ---
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    customerName: '',
    email: '', 
    phone: '',
    guestCount: 2,
    branch: 'Chi nhánh 1', 
    reservationDate: today, // Mặc định để ngày hôm nay
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
    };

    axios.post('http://localhost:8080/api/reservations', dataToSend)
      .then(() => {
        alert("🎉 Đặt bàn thành công! Chúng tôi sẽ liên hệ xác nhận sớm.");
        setFormData({ ...formData, customerName: '', phone: '', note: '', reservationDate: today });
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
              src="data:image/jpeg;base64,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" 
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

            {/* Hàng 3: Chọn Nhà hàng  */}
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
                  // --- THÊM THUỘC TÍNH MIN ĐỂ CHẶN NGÀY QUÁ KHỨ ---
                  min={today}
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