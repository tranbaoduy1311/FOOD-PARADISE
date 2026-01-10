import React, { useState } from 'react';
import BillModal from './BillModal';

const PosOrderInterface = ({
    // Dữ liệu (Props)
    table,
    currentUser,
    products,
    categories,
    currentOrder,
    orderDetails,
    
    // State từ cha truyền xuống
    activeCategory, setActiveCategory,
    productSearch, setProductSearch,
    kitchenNote, setKitchenNote,
    customer, setCustomer,
    phoneSearch, setPhoneSearch,
    pointsToUse, setPointsToUse,
    availableVouchers,
    voucherCode, setVoucherCode,

    // Các hàm xử lý (Handlers)
    onBackToMap,
    onAddToOrder,
    onRemoveItem,
    onSearchCustomer,
    onApplyVoucher,
    onConfirmPayment
}) => {
    
    // State nội bộ cho việc hiển thị Bill Modal
    const [showBill, setShowBill] = useState(false);

    // --- LOGIC LỌC SẢN PHẨM ---
    const filteredProducts = products.filter(product => {
        const matchCategory = activeCategory === 'ALL' || product.category?.id === activeCategory;
        const matchSearch = product.name.toLowerCase().includes(productSearch.toLowerCase());
        return matchCategory && matchSearch;
    });

    // --- LOGIC TÍNH TIỀN ---
    // Sửa lỗi hiển thị 0đ
    const basePrice = currentOrder 
        ? (currentOrder.discountAmount > 0 ? currentOrder.finalPrice : currentOrder.totalPrice) 
        : 0;
    const discountFromPoints = pointsToUse * 1000;
    const finalAmountToPay = basePrice - discountFromPoints;

    // Xử lý khi bấm nút Thanh Toán
    const handleCheckoutClick = () => {
        if (!currentOrder) return;
        setShowBill(true);
    };

    // Xử lý khi xác nhận thanh toán xong trong Modal
    const handlePaymentDone = () => {
        onConfirmPayment(); // Gọi hàm thanh toán của cha
        setShowBill(false); // Đóng modal
    };

    return (
        <div className="pos-container">
            {/* --- CỘT TRÁI: MENU MÓN ĂN --- */}
            <div className="pos-menu-section flex flex-col h-full">
                
                {/* Header: Tên bàn & Nhân viên */}
                <div className="flex items-center justify-between mb-4 shrink-0">
                    <div className="flex items-center">
                        <button onClick={onBackToMap} className="bg-white border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-xl mr-4 font-bold shadow-sm text-gray-700">
                            ⬅ Sảnh
                        </button>
                        <h2 className="text-2xl font-extrabold text-gray-800">{table?.name}</h2>
                    </div>
                    <div className="text-right text-sm text-gray-500 bg-white px-3 py-1 rounded-lg shadow-sm border border-gray-100">
                        Phục vụ: <span className="font-bold text-blue-600">{currentUser.name}</span>
                    </div>
                </div>

                {/* Tìm kiếm & Danh mục */}
                <div className="mb-4 space-y-3 shrink-0">
                    <div className="relative">
                        <input 
                            type="text" 
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none shadow-sm"
                            placeholder="Tìm món ăn (VD: Cà phê, Cơm tấm)..."
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                        />
                        <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        <button 
                            onClick={() => setActiveCategory('ALL')}
                            className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-all border ${
                                activeCategory === 'ALL' 
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                            Tất cả
                        </button>
                        {categories.map(cat => (
                            <button 
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-all border ${
                                    activeCategory === cat.id 
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Ghi chú bếp */}
                <div className="mb-4 bg-white p-3 rounded-xl border border-gray-200 flex items-center gap-2 shadow-sm shrink-0">
                    <span className="text-xl">📝</span>
                    <input type="text" className="w-full bg-transparent outline-none text-gray-700 font-medium" placeholder="Ghi chú cho bếp (VD: Không hành, ít đá...)" value={kitchenNote} onChange={(e) => setKitchenNote(e.target.value)} />
                </div>

                {/* Danh sách món ăn (Grid) */}
                <div className="flex-1 overflow-y-auto pr-2 pb-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(p => (
                                <div 
                                    key={p.id} 
                                    className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-200 overflow-hidden cursor-pointer transition-transform hover:-translate-y-1 flex flex-col h-full"
                                    onClick={() => onAddToOrder(p)}
                                >
                                    <div className="h-32 w-full overflow-hidden">
                                        <img 
                                            src={p.image || "https://via.placeholder.com/150"} 
                                            alt={p.name} 
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                                        />
                                    </div>
                                    <div className="p-3 flex flex-col flex-1 justify-between">
                                        <h3 className="font-bold text-gray-800 text-sm line-clamp-2 mb-1" title={p.name}>
                                            {p.name}
                                        </h3>
                                        <p className="text-red-600 font-extrabold text-sm">
                                            {p.price ? p.price.toLocaleString() : 0} đ
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10 text-gray-400">
                                Không tìm thấy món nào.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- CỘT PHẢI: GIỎ HÀNG & THANH TOÁN --- */}
            <div className="pos-cart-section">
                
                {/* Tìm khách hàng & Tích điểm */}
                <div className="p-4 bg-white border-b border-gray-100">
                    {customer ? (
                        <div className="bg-green-50 p-3 rounded-xl border border-green-200 space-y-2">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-green-800">{customer.name}</p>
                                    <p className="text-xs text-green-600 font-bold">💎 {customer.points} điểm</p>
                                </div>
                                <button onClick={() => {setCustomer(null); setPointsToUse(0);}} className="text-red-400 hover:text-red-600 font-bold text-lg">×</button>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-2">
                                <label className="text-xs font-bold text-gray-600">Dùng điểm:</label>
                                <input 
                                    type="number" 
                                    className="w-20 border border-green-300 rounded px-2 py-1 text-sm text-center font-bold text-green-700 outline-none focus:ring-2 focus:ring-green-200"
                                    value={pointsToUse}
                                    onChange={(e) => {
                                        let val = parseInt(e.target.value) || 0;
                                        if (val > customer.points) val = customer.points; 
                                        if (val * 1000 > (currentOrder?.totalPrice || 0)) val = Math.floor((currentOrder?.totalPrice || 0) / 1000); 
                                        setPointsToUse(val);
                                    }}
                                />
                                <span className="text-xs text-gray-500">(-{(pointsToUse * 1000).toLocaleString()}đ)</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                                placeholder="Tìm khách (SĐT)..."
                                value={phoneSearch}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (!isNaN(val)) setPhoneSearch(val); 
                                }}
                                onKeyPress={(e) => e.key === 'Enter' && onSearchCustomer()}
                                maxLength={10} 
                            />
                            <button onClick={onSearchCustomer} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md transition">
                                Tìm
                            </button>
                        </div>
                    )}
                </div>

                {/* Header Giỏ hàng */}
                <div className="pos-cart-header bg-gray-50 border-b border-gray-200">
                    <h3 className="text-lg font-extrabold text-gray-800">Đơn hàng hiện tại</h3>
                    <p className="text-xs text-gray-500 font-mono">#{currentOrder?.id || "NEW"}</p>
                </div>
                
                {/* Danh sách món đã gọi */}
                <div className="pos-cart-items-container bg-white">
                    {orderDetails.map((item, index) => (
                        <div key={index} className="pos-cart-item flex-col items-start border-b border-dashed border-gray-100 last:border-0 relative group">
                            <div className="flex justify-between w-full items-center">
                                <div>
                                    <p className="pos-cart-item-name text-gray-800">{item.productName}</p>
                                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">x{item.quantity}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <p className="font-bold text-gray-800">{(item.price * item.quantity).toLocaleString()}</p>
                                    <button 
                                        onClick={() => onRemoveItem(item.id)}
                                        className="text-red-400 hover:text-red-600 font-bold text-lg px-2 hover:bg-red-50 rounded transition"
                                        title="Xóa món"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                            {item.note && <p className="text-xs text-orange-600 italic mt-1 bg-orange-50 px-2 py-1 rounded w-full border border-orange-100">Note: {item.note}</p>}
                        </div>
                    ))}
                    {orderDetails.length === 0 && (
                        <div className="text-center py-10 text-gray-400">
                            <div className="text-4xl mb-2">🧾</div>
                            Chưa có món nào
                        </div>
                    )}
                </div>

                {/* Footer Thanh toán */}
                <div className="pos-checkout-section bg-white border-t border-gray-200 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                    
                    {/* Khu vực Mã giảm giá */}
                    {currentOrder && (
                        <div className="mb-3 pb-3 border-b border-dashed border-gray-300">
                            <div className="flex gap-2">
                                <input 
                                    list="voucher-list" 
                                    type="text" 
                                    placeholder="Mã giảm giá..." 
                                    className="flex-1 border border-gray-300 rounded px-2 py-1.5 uppercase text-sm focus:outline-none focus:border-blue-500"
                                    value={voucherCode}
                                    onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                                />
                                <datalist id="voucher-list">
                                    {availableVouchers.map(v => (
                                        <option key={v.id} value={v.code}>
                                            {v.description} ({v.discountType === 'PERCENTAGE' ? `-${v.discountValue}%` : `-${v.discountValue}đ`})
                                        </option>
                                    ))}
                                </datalist>
                                <button 
                                    onClick={onApplyVoucher}
                                    className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-bold hover:bg-blue-700"
                                >
                                    Áp dụng
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Tổng tiền */}
                    <div className="space-y-1 mb-4">
                        <div className="flex justify-between text-gray-500 text-sm">
                            <span>Tổng tiền hàng:</span>
                            <span>{currentOrder?.totalPrice?.toLocaleString() || 0} đ</span>
                        </div>
                        
                        {currentOrder?.discountAmount > 0 && (
                            <div className="flex justify-between text-green-600 text-sm font-medium">
                                <span>Voucher ({currentOrder.voucherCode}):</span>
                                <span>- {currentOrder.discountAmount?.toLocaleString()} đ</span>
                            </div>
                        )}

                        {pointsToUse > 0 && (
                            <div className="flex justify-between text-green-600 text-sm font-medium">
                                <span>Dùng điểm ({pointsToUse}):</span>
                                <span>-{(pointsToUse * 1000).toLocaleString()} đ</span>
                            </div>
                        )}

                        <div className="flex justify-between items-end pt-2 border-t border-dashed border-gray-300">
                            <span className="text-gray-800 font-bold">Khách phải trả:</span>
                            <span className="text-3xl text-red-600 font-extrabold">
                                {finalAmountToPay > 0 ? finalAmountToPay.toLocaleString() : 0} đ
                            </span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleCheckoutClick} 
                        disabled={!currentOrder || orderDetails.length === 0} 
                        className={`pos-btn-checkout ${(!currentOrder || orderDetails.length === 0) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                    >
                        THANH TOÁN
                    </button>
                </div>
            </div>

            {/* Modal Hóa đơn */}
            {showBill && currentOrder && (
                <BillModal 
                    order={{...currentOrder, finalPrice: finalAmountToPay}} 
                    items={orderDetails}
                    table={table}
                    onClose={() => setShowBill(false)}
                    onConfirm={handlePaymentDone}
                />
            )}
        </div>
    );
};

export default PosOrderInterface;