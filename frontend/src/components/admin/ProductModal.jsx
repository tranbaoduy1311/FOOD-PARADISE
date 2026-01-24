import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductModal = ({ product, onClose, onSave }) => {
    const [categories, setCategories] = useState([]);

    // --- SỬA TẠI ĐÂY: Khởi tạo state trực tiếp từ product prop ---
    const [formData, setFormData] = useState({
        name: product?.name || '',
        price: product?.price || '',
        image: product?.image || '',
        categoryId: product?.category?.id || product?.categoryId || '',
        status: product?.status !== undefined ? product.status : true
    });

    useEffect(() => {
        // useEffect bây giờ CHỈ làm nhiệm vụ lấy danh sách danh mục
        axios.get('http://localhost:8080/api/categories')
            .then(res => setCategories(res.data))
            .catch(err => console.error("Lỗi lấy danh mục:", err));
    }, []); // Để mảng rỗng để chỉ chạy 1 lần khi mở modal

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            name: formData.name,
            price: parseFloat(formData.price),
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
                alert("Lỗi khi lưu món ăn!");
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên món ăn</label>
                        <input 
                            required
                            type="text" 
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VNĐ)</label>
                            <input 
                                required
                                type="number" 
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.price}
                                onChange={e => setFormData({...formData, price: e.target.value})}
                            />
                        </div>
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link hình ảnh</label>
                        <input 
                            type="text" 
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.image}
                            onChange={e => setFormData({...formData, image: e.target.value})}
                        />
                    </div>

                    <div className="flex items-center gap-2 py-2">
                        <input 
                            type="checkbox" 
                            id="status"
                            checked={formData.status}
                            onChange={e => setFormData({...formData, status: e.target.checked})}
                        />
                        <label htmlFor="status" className="text-sm font-medium text-gray-700">Đang kinh doanh</label>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-lg font-bold">Hủy</button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-lg">
                            {product ? 'Cập nhật ngay' : 'Lưu món ăn'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;