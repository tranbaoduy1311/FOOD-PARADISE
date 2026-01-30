import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SupplierManager = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPayModalOpen, setIsPayModalOpen] = useState(false);
    
    // Form thêm/sửa
    const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
    const [editingId, setEditingId] = useState(null);

    // Form thanh toán nợ
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [payAmount, setPayAmount] = useState(0);

    // --- 1. KHAI BÁO HÀM BÌNH THƯỜNG (Không cần useCallback) ---
    const fetchSuppliers = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/admin/suppliers');
            setSuppliers(res.data);
        } catch (error) { 
            console.error(error);
        }
    };

    // --- 2. GỌI HÀM TRONG USE EFFECT (KÈM DÒNG TẮT CẢNH BÁO) ---
    useEffect(() => {
        fetchSuppliers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    // --- XỬ LÝ THÊM / SỬA ---
    const handleSave = async () => {
        try {
            if (editingId) {
                await axios.put(`http://localhost:8080/api/admin/suppliers/${editingId}`, formData);
            } else {
                await axios.post('http://localhost:8080/api/admin/suppliers', formData);
            }
            setIsModalOpen(false);
            fetchSuppliers(); // Gọi lại hàm để refresh danh sách
            alert("Lưu thành công!");
        } catch (error) { 
            console.error(error);
            alert("Lỗi lưu dữ liệu"); 
        }
    };

    const openEdit = (s) => {
        setEditingId(s.id);
        setFormData({ name: s.name, phone: s.phone, address: s.address });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if(window.confirm("Xóa nhà cung cấp này?")) {
            try {
                await axios.delete(`http://localhost:8080/api/admin/suppliers/${id}`);
                fetchSuppliers();
            } catch (error) {
                console.error(error);
            }
        }
    };

    // --- XỬ LÝ THANH TOÁN NỢ ---
    const openPayModal = (s) => {
        setSelectedSupplier(s);
        setPayAmount(0);
        setIsPayModalOpen(true);
    };

    const handlePayDebt = async () => {
        if(!selectedSupplier || payAmount <= 0) return;
        try {
            await axios.post(`http://localhost:8080/api/admin/suppliers/${selectedSupplier.id}/pay-debt?amount=${payAmount}`);
            setIsPayModalOpen(false);
            fetchSuppliers();
            alert(`Đã trả ${payAmount.toLocaleString()}đ cho ${selectedSupplier.name}`);
        } catch (error) { 
            console.error(error);
            alert("Lỗi thanh toán"); 
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">🏭 Nhà Cung Cấp & Công Nợ</h1>
                <button 
                    onClick={() => { setEditingId(null); setFormData({name:'', phone:'', address:''}); setIsModalOpen(true); }}
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                >
                    + Thêm NCC Mới
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {suppliers.map(s => (
                    <div key={s.id} className="bg-white p-5 rounded-lg shadow border border-gray-200 relative">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg text-gray-800">{s.name}</h3>
                            <div className="flex gap-2">
                                <button onClick={() => openEdit(s)} className="text-blue-500 text-sm">Sửa</button>
                                <button onClick={() => handleDelete(s.id)} className="text-red-500 text-sm">Xóa</button>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm mt-1">📞 {s.phone || '---'}</p>
                        <p className="text-gray-500 text-sm">📍 {s.address || '---'}</p>
                        
                        <div className="mt-4 pt-4 border-t flex justify-between items-center">
                            <div>
                                <p className="text-xs text-gray-500">Công nợ hiện tại:</p>
                                <p className={`font-bold text-xl ${s.totalDebt > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {s.totalDebt?.toLocaleString()} đ
                                </p>
                            </div>
                            {s.totalDebt > 0 && (
                                <button 
                                    onClick={() => openPayModal(s)}
                                    className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-bold hover:bg-green-200"
                                >
                                    Trả nợ
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Thêm/Sửa */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-4">{editingId ? 'Cập nhật NCC' : 'Thêm NCC Mới'}</h2>
                        <input className="w-full border p-2 rounded mb-3" placeholder="Tên nhà cung cấp (*)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        <input className="w-full border p-2 rounded mb-3" placeholder="Số điện thoại" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        <input className="w-full border p-2 rounded mb-3" placeholder="Địa chỉ" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Hủy</button>
                            <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded">Lưu</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Thanh Toán Nợ */}
            {isPayModalOpen && selectedSupplier && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold mb-2">Thanh toán công nợ</h2>
                        <p className="text-gray-600 mb-4">Trả tiền cho: <b>{selectedSupplier.name}</b></p>
                        
                        <div className="bg-red-50 p-3 rounded mb-4 text-center">
                            <p className="text-sm text-gray-500">Đang nợ:</p>
                            <p className="text-xl font-bold text-red-600">{selectedSupplier.totalDebt?.toLocaleString()} đ</p>
                        </div>

                        <label className="text-sm font-bold">Số tiền trả:</label>
                        <input 
                            type="number" 
                            className="w-full border p-2 rounded mt-1 mb-4 font-bold text-green-700" 
                            value={payAmount} 
                            onChange={e => setPayAmount(Number(e.target.value))} 
                        />

                        <div className="flex justify-end gap-2">
                            <button onClick={() => setIsPayModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Hủy</button>
                            <button onClick={handlePayDebt} className="px-4 py-2 bg-green-600 text-white rounded font-bold">Xác nhận trả</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupplierManager;