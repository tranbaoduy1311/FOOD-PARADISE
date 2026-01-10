import React from 'react';

const BillModal = ({ order, items, table, onClose, onConfirm }) => {
  
  // --- CẤU HÌNH NGÂN HÀNG ---
  const BANK_ID = "ABB"; 
  const ACCOUNT_NO = "0369203304"; 
  const ACCOUNT_NAME = "TRAN BAO DUY"; 
  
  // Lấy giá cuối cùng (Đã được tính toán bên PosPage và truyền qua prop 'order')
  // Nếu finalPrice chưa có (null/undefined) thì dùng totalPrice
  const finalAmount = order.finalPrice ?? order.totalPrice;

  // Tạo QR Code dựa trên giá cuối cùng
  const qrUrl = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-compact.jpg?amount=${finalAmount}&addInfo=Thanh toan Ban ${table.name}`;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white w-[400px] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gray-800 text-white p-4 text-center relative">
            <button onClick={onClose} className="absolute left-4 top-4 text-gray-400 hover:text-white">✕</button>
            <h2 className="text-xl font-bold uppercase">Hóa Đơn Thanh Toán</h2>
            <p className="text-sm opacity-80">{new Date().toLocaleString()}</p>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Thông tin quán & Bàn */}
          <div className="text-center mb-4 border-b border-dashed border-gray-300 pb-4">
            <h3 className="text-2xl font-extrabold text-gray-800">FOOD PARADISE</h3>
            <div className="mt-2 font-bold text-lg">Bàn: {table.name}</div>
            <div className="text-sm text-gray-500">Mã đơn: #{order.id}</div>
          </div>

          {/* Danh sách món ăn */}
          <table className="w-full text-sm mb-4">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-1">Món</th>
                <th className="text-center py-1">SL</th>
                <th className="text-right py-1">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b border-dashed border-gray-200">
                  <td className="py-2">
                    <div className="font-bold">{item.productName}</div>
                    {item.note && <div className="text-xs text-gray-400 italic">({item.note})</div>}
                  </td>
                  <td className="text-center py-2">x{item.quantity}</td>
                  <td className="text-right py-2">{(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* --- TỔNG TIỀN & HIỂN THỊ GIẢM GIÁ --- */}
          <div className="border-t border-gray-800 pt-4 mb-6 space-y-2">
            <div className="flex justify-between text-gray-600">
                <span>Tổng tiền hàng:</span>
                <span>{order.totalPrice?.toLocaleString()} đ</span>
            </div>
            
            {/* Chỉ hiển thị dòng này nếu có giảm giá (Voucher hoặc Điểm) */}
            {order.discountAmount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                    <span>Đã giảm giá:</span>
                    <span>- {order.discountAmount?.toLocaleString()} đ</span>
                </div>
            )}

            {/* Nếu có mã voucher cụ thể thì hiện thêm cho rõ (Optional) */}
            {order.voucherCode && (
                <div className="text-right text-xs text-gray-400 italic">
                    (Mã: {order.voucherCode})
                </div>
            )}

            <div className="flex justify-between items-center text-2xl font-bold text-red-600 pt-2 border-t border-dashed">
                <span>THANH TOÁN:</span>
                <span>{finalAmount?.toLocaleString()} đ</span>
            </div>
          </div>

          {/* Mã QR */}
          <div className="text-center bg-blue-50 p-4 rounded-xl border border-blue-100">
            <p className="font-bold text-blue-800 mb-2">Quét mã để thanh toán</p>
            <img src={qrUrl} alt="QR Code" className="w-48 h-48 mx-auto border-2 border-white shadow-sm" />
            <p className="text-xs text-gray-500 mt-2">
              {BANK_ID} - {ACCOUNT_NO} <br/> {ACCOUNT_NAME}
            </p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 border-t bg-gray-50 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition"
          >
            Quay lại
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-lg flex items-center justify-center gap-2"
          >
            <span>✅</span> Xác nhận đã thu tiền
          </button>
        </div>

      </div>
    </div>
  );
};

export default BillModal;