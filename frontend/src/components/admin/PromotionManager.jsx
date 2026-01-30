import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PromotionManager = () => {
    const [promotions, setPromotions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // State cho Form MÃ KHUYẾN MÃI
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discountType: 'PERCENTAGE',
        discountValue: 0,
        minOrderValue: 0,
        maxDiscountAmount: 0,
        startDate: '',
        endDate: '',
        startHour: '',
        endHour: '',
        status: 'ACTIVE'
    });
    const [editingId, setEditingId] = useState(null);

    const fetchPromotions = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/admin/promotions');
            setPromotions(res.data);
        } catch (error) {
            console.error("Lỗi tải dữ liệu", error);
        }
    };

    useEffect(() => {
        fetchPromotions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 
    // Xử lý Input thay đổi
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Mở Modal (Thêm mới hoặc Sửa)
    const openModal = (promo = null) => {
        if (promo) {
            setEditingId(promo.id);
            setFormData({
                ...promo,
                startDate: promo.startDate ? promo.startDate.substring(0, 16) : '',
                endDate: promo.endDate ? promo.endDate.substring(0, 16) : '',
            });
        } else {
            setEditingId(null);
            setFormData({
                code: '', description: '', discountType: 'PERCENTAGE', discountValue: 0,
                minOrderValue: 0, maxDiscountAmount: 0, startDate: '', endDate: '',
                startHour: '', endHour: '', status: 'ACTIVE'
            });
        }
        setIsModalOpen(true);
    };

    // Lưu dữ liệu
    const handleSave = async () => {
        try {
            const payload = { ...formData };
            // Xử lý giá trị rỗng
            if (!payload.startDate) payload.startDate = null;
            if (!payload.endDate) payload.endDate = null;
            if (!payload.startHour) payload.startHour = null;
            if (!payload.endHour) payload.endHour = null;

            if (editingId) {
                await axios.put(`http://localhost:8080/api/admin/promotions/${editingId}`, payload);
            } else {
                await axios.post('http://localhost:8080/api/admin/promotions', payload);
            }
            setIsModalOpen(false);
            fetchPromotions(); // Gọi lại hàm để refresh danh sách
            alert("Lưu thành công!");
        } catch (error) {
            alert("Lỗi khi lưu!");
            console.error(error);
        }
    };

    // Xóa
    const handleDelete = async (id) => {
        if (window.confirm("Bạn chắc chắn muốn xóa mã này?")) {
            try {
                await axios.delete(`http://localhost:8080/api/admin/promotions/${id}`);
                fetchPromotions();
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản Lý Khuyến Mãi</h1>
                <button 
                    onClick={() => openModal()}
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                >
                    + Thêm Mã Mới
                </button>
            </div>

            {/* Bảng Danh Sách */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
                        <tr>
                            <th className="p-3 border">Mã Code</th>
                            <th className="p-3 border">Mô tả</th>
                            <th className="p-3 border">Giảm giá</th>
                            <th className="p-3 border">Điều kiện</th>
                            <th className="p-3 border">Thời gian</th>
                            <th className="p-3 border">Trạng thái</th>
                            <th className="p-3 border">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {promotions.map((promo) => (
                            <tr key={promo.id} className="hover:bg-gray-50 border-b">
                                <td className="p-3 font-bold text-blue-600">{promo.code}</td>
                                <td className="p-3">{promo.description}</td>
                                <td className="p-3">
                                    {promo.discountType === 'PERCENTAGE' 
                                        ? <span className="text-red-500 font-bold">{promo.discountValue}%</span> 
                                        : <span className="text-green-600 font-bold">{promo.discountValue.toLocaleString()}đ</span>
                                    }
                                </td>
                                <td className="p-3 text-sm">
                                    Đơn tối thiểu: {promo.minOrderValue?.toLocaleString()}đ
                                </td>
                                <td className="p-3 text-sm text-gray-500">
                                    {promo.startDate && <div>Từ: {new Date(promo.startDate).toLocaleDateString()}</div>}
                                    {promo.endDate && <div>Đến: {new Date(promo.endDate).toLocaleDateString()}</div>}
                                    {promo.startHour && <div className="text-orange-500">Giờ vàng: {promo.startHour} - {promo.endHour}</div>}
                                </td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 rounded text-xs ${promo.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {promo.status}
                                    </span>
                                </td>
                                <td className="p-3 flex gap-2">
                                    <button onClick={() => openModal(promo)} className="text-blue-500 hover:underline">Sửa</button>
                                    <button onClick={() => handleDelete(promo.id)} className="text-red-500 hover:underline">Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-[600px] max-h-[90vh] overflow-y-auto shadow-xl">
                        <h2 className="text-xl font-bold mb-4">{editingId ? 'Cập Nhật Mã' : 'Tạo Mã Mới'}</h2>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-1">
                                <label className="block text-sm font-medium">Mã Code (*)</label>
                                <input name="code" value={formData.code} onChange={handleChange} className="w-full border p-2 rounded uppercase" placeholder="VD: SALE10" />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium">Trạng thái</label>
                                <select name="status" value={formData.status} onChange={handleChange} className="w-full border p-2 rounded">
                                    <option value="ACTIVE">Hoạt động</option>
                                    <option value="INACTIVE">Tạm dừng</option>
                                </select>
                            </div>
                            
                            <div className="col-span-2">
                                <label className="block text-sm font-medium">Mô tả</label>
                                <input name="description" value={formData.description} onChange={handleChange} className="w-full border p-2 rounded" />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium">Loại giảm giá</label>
                                <select name="discountType" value={formData.discountType} onChange={handleChange} className="w-full border p-2 rounded">
                                    <option value="PERCENTAGE">Theo Phần Trăm (%)</option>
                                    <option value="FIXED">Theo Tiền Mặt (VNĐ)</option>
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium">Giá trị giảm</label>
                                <input type="number" name="discountValue" value={formData.discountValue} onChange={handleChange} className="w-full border p-2 rounded" />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium">Đơn tối thiểu</label>
                                <input type="number" name="minOrderValue" value={formData.minOrderValue} onChange={handleChange} className="w-full border p-2 rounded" />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium">Giảm tối đa (Nếu là %)</label>
                                <input type="number" name="maxDiscountAmount" value={formData.maxDiscountAmount} onChange={handleChange} className="w-full border p-2 rounded" />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium">Ngày bắt đầu</label>
                                <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full border p-2 rounded" />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium">Ngày kết thúc</label>
                                <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full border p-2 rounded" />
                            </div>

                            <div className="col-span-2 border-t pt-2 mt-2">
                                <p className="font-bold text-sm mb-2 text-orange-600">Cấu hình Giờ Vàng (Happy Hour) - Tùy chọn</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm">Giờ bắt đầu</label>
                                        <input type="time" name="startHour" value={formData.startHour} onChange={handleChange} className="w-full border p-2 rounded" />
                                    </div>
                                    <div>
                                        <label className="block text-sm">Giờ kết thúc</label>
                                        <input type="time" name="endHour" value={formData.endHour} onChange={handleChange} className="w-full border p-2 rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Hủy</button>
                            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Lưu thông tin</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromotionManager;