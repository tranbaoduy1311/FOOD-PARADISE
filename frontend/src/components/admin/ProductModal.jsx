import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductModal = ({ product, onClose, onSave }) => {
    const [categories, setCategories] = useState([]);
    
    // State để hiển thị ảnh xem trước
    const [imagePreview, setImagePreview] = useState(product?.image || null);

    const [formData, setFormData] = useState({
        name: product?.name || '',
        price: product?.price || '',
        image: product?.image || '',
        categoryId: product?.category?.id || product?.categoryId || '',
        status: product?.status !== undefined ? product.status : true
    });

    useEffect(() => {
        // Lấy danh sách danh mục
        axios.get('http://localhost:8080/api/categories')
            .then(res => setCategories(res.data))
            .catch(err => console.error("Lỗi lấy danh mục:", err));
    }, []); 

    // --- HÀM XỬ LÝ KHI CHỌN FILE TỪ MÁY TÍNH ---
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Kiểm tra dung lượng file (nên dưới 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert("Ảnh quá lớn! Vui lòng chọn ảnh dưới 2MB.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result;
                setImagePreview(base64String); // Hiển thị ảnh lên giao diện
                setFormData({ ...formData, image: base64String }); // Lưu chuỗi Base64 vào formData
            };
            reader.readAsDataURL(file); // Chuyển ảnh thành chuỗi ký tự Base64
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.categoryId) {
            alert("Vui lòng chọn danh mục!");
            return;
        }

        const payload = {
            name: formData.name,
            price: parseFloat(formData.price),
            // Nếu không chọn ảnh thì dùng ảnh mặc định
            image: formData.image || "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=500",
            status: formData.status,
            category: { id: parseInt(formData.categoryId) }
        };

        if (product && product.id) {
            payload.id = product.id;
        }

        axios.post('http://localhost:8080/api/products', payload)
            .then(() => {
                alert(product ? "Cập nhật thành công!" : "Thêm món thành công!");
                onSave();
                onClose();
            })
            .catch(err => {
                console.error("Lỗi:", err);
                alert("Lỗi khi lưu món ăn! (Lưu ý: Nếu ảnh quá nặng có thể gây lỗi Database)");
            });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 w-[500px] shadow-2xl animate-bounce-in">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    <span className="mr-2">{product ? '✏️' : '🍔'}</span> 
                    {product ? 'Cập Nhật Món Ăn' : 'Thêm Món Ăn Mới'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Tên món */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên món ăn</label>
                        <input 
                            required
                            type="text" 
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Nhập tên món..."
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Giá bán */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VNĐ)</label>
                            <input 
                                required
                                type="number" 
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="0"
                                value={formData.price}
                                onChange={e => setFormData({...formData, price: e.target.value})}
                            />
                        </div>
                        {/* Danh mục */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                            <select 
                                required
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.categoryId}
                                onChange={e => setFormData({...formData, categoryId: e.target.value})}
                            >
                                <option value="">-- Chọn --</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* PHẦN CHỌN ẢNH TỪ FILE EXPLORER */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh món ăn</label>
                        <div className="flex items-center gap-4">
                            {/* Khung xem trước ảnh */}
                            <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden bg-gray-50">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-gray-400 text-[10px] text-center px-1">Chưa có ảnh</span>
                                )}
                            </div>
                            
                            {/* Nút chọn file ẩn đi và thay bằng label đẹp hơn */}
                            <label className="cursor-pointer bg-blue-50 text-blue-600 px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-100 transition text-sm font-bold">
                                📁 Chọn ảnh từ máy
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </label>
                        </div>
                    </div>

                    {/* Trạng thái */}
                    <div className="flex items-center gap-2 py-2">
                        <input 
                            type="checkbox" 
                            id="status"
                            className="w-4 h-4 text-blue-600"
                            checked={formData.status}
                            onChange={e => setFormData({...formData, status: e.target.checked})}
                        />
                        <label htmlFor="status" className="text-sm font-medium text-gray-700 cursor-pointer">Đang kinh doanh</label>
                    </div>

                    {/* Nút điều khiển */}
                    <div className="flex justify-end gap-3 mt-8">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-lg font-bold hover:bg-gray-300 transition">Hủy</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-lg hover:bg-blue-700 transition">
                            {product ? 'Cập nhật ngay' : 'Lưu món ăn'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;