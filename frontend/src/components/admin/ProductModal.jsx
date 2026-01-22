import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductModal = ({ onClose, onSave }) => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        image: '',
        categoryId: '',
        status: true
    });

    useEffect(() => {
        // Lấy danh sách danh mục để đổ vào dropdown
        axios.get('/api/categories')
            .then(res => setCategories(res.data))
            .catch(err => console.error("Lỗi lấy danh mục:", err));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Chuẩn bị dữ liệu theo cấu trúc Entity Product (có object category)
        const payload = {
            name: formData.name,
            price: parseFloat(formData.price),
            image: formData.image || "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?q=80&w=500",
            status: formData.status,
            category: { id: parseInt(formData.categoryId) }
        };

        axios.post('/api/products', payload)
            .then(() => {
                alert("Thêm món thành công!");
                onSave(); // Load lại danh sách
                onClose(); // Đóng modal
            })
.catch(err => {
    console.error("Chi tiết lỗi:", err); // Sử dụng biến err ở đây
    alert("Lỗi khi thêm món!");
});    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-8 w-[500px] shadow-2xl">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    <span className="mr-2">🍔</span> Thêm Món Ăn Mới
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên món ăn</label>
                        <input 
                            required
                            type="text" 
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Ví dụ: Cà phê muối"
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
                                 min="0"
                                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="35000"
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Link hình ảnh (Unsplash/URL)</label>
                        <input 
                            type="text" 
                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="https://images.unsplash.com/..."
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
                        <button 
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-bold"
                        >
                            Hủy
                        </button>
                        <button 
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-lg shadow-blue-200"
                        >
                            Lưu món ăn
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;