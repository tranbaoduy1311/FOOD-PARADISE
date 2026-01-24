import React, { useState } from 'react';
import axios from 'axios';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.post('/api/contact', formData)
      .then(() => {
        alert("Cảm ơn bạn! Tin nhắn đã được gửi thành công.");
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      })
      .catch(() => alert("Lỗi khi gửi tin nhắn. Vui lòng thử lại!"))
      .finally(() => setLoading(false));
  };

  return (
    <div className="bg-white min-h-screen">
      {/* BANNER ĐẦU TRANG */}
      <div className="h-64 bg-gray-900 flex items-center justify-center relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600" className="absolute inset-0 w-full h-full object-cover opacity-40" alt="Contact" />
        <h1 className="relative z-10 text-5xl font-extrabold text-white tracking-tight">LIÊN HỆ</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* THÔNG TIN BÊN TRÁI */}
        <div className="space-y-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Kết Nối Với Food Paradise</h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Chúng tôi luôn sẵn lòng lắng nghe ý kiến đóng góp và phản hồi từ quý khách để nâng cao chất lượng dịch vụ.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ContactInfo icon="📍" title="Địa chỉ" content="123 Đường ABC, Quận 1, TP.HCM" />
            <ContactInfo icon="📞" title="Hotline" content="0909.123.456" />
            <ContactInfo icon="✉️" title="Email" content="contact@foodparadise.com" />
            <ContactInfo icon="⏰" title="Giờ làm việc" content="07:00 - 22:00 (Hàng ngày)" />
          </div>

          {/* BẢN ĐỒ GOOGLE MAPS (NHÚNG) */}
          <div className="rounded-3xl overflow-hidden shadow-lg h-80 border-4 border-white">
            <iframe 
              title="map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4478774324483!2d106.6920812758382!3d10.77312725918341!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f385570472f%3A0x178d8ca955241645!2zS2jDoWNoIHPhuqFuIE5ldyBXb3JsZCBTYWlnb24!5e0!3m2!1svi!2s!4v1710000000000!5m2!1svi!2s" 
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy">
            </iframe>
          </div>
        </div>

        {/* FORM GỬI TIN NHẮN BÊN PHẢI */}
        <div className="bg-gray-50 p-10 rounded-[40px] shadow-2xl border border-white relative">
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white text-3xl shadow-lg">✉️</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-8">Gửi tin nhắn cho chúng tôi</h3>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 ml-2">Họ và tên *</label>
                <input required type="text" className="w-full p-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Nguyễn Văn A"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-600 ml-2">Số điện thoại</label>
                <input type="text" className="w-full p-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-orange-500 outline-none" placeholder="0909..."
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600 ml-2">Email</label>
              <input type="email" className="w-full p-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-orange-500 outline-none" placeholder="example@gmail.com"
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600 ml-2">Chủ đề</label>
              <input type="text" className="w-full p-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Góp ý, Đặt tiệc..."
                value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600 ml-2">Nội dung tin nhắn *</label>
              <textarea required rows="4" className="w-full p-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-orange-500 outline-none" placeholder="Nhập nội dung tại đây..."
                value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-gray-900 hover:bg-orange-600 text-white font-bold py-5 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-orange-200 uppercase tracking-widest">
              {loading ? "Đang xử lý..." : "Gửi yêu cầu ngay"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const ContactInfo = ({ icon, title, content }) => (
  <div className="flex items-start gap-4">
    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl shadow-sm">{icon}</div>
    <div>
      <h4 className="font-bold text-gray-800">{title}</h4>
      <p className="text-gray-500 text-sm">{content}</p>
    </div>
  </div>
);

export default ContactPage;