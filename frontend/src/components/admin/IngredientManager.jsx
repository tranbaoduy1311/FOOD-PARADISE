import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IngredientManager = () => {
  const [ingredients, setIngredients] = useState([]);
  const [importHistory, setImportHistory] = useState([]);
  const [importAmount, setImportAmount] = useState({});
  const [suppliers, setSuppliers] = useState([]); // --- MỚI: Danh sách NCC

  // --- STATE CHO FORM NHẬP NHANH ---
  const [quickItem, setQuickItem] = useState({
    name: '',
    quantity: '', 
    unit: 'kg',   
    costPrice: '',
    supplierId: '', // --- MỚI
    isDebt: false   // --- MỚI
  });

  // --- STATE CHO NHẬP HÀNG CÓ SẴN (Mỗi item có state riêng cho NCC và Nợ) ---
  const [importOptions, setImportOptions] = useState({}); 

  // --- STATE CHO CHẾ ĐỘ CHỈNH SỬA ---
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // --- API CALLS ---
  const fetchIngredients = () => axios.get('http://localhost:8080/api/admin/ingredients').then(res => setIngredients(res.data));
  const fetchHistory = () => axios.get('http://localhost:8080/api/admin/ingredients/history/today').then(res => setImportHistory(res.data));
  const fetchSuppliers = () => axios.get('http://localhost:8080/api/admin/suppliers').then(res => setSuppliers(res.data)); // --- MỚI

  useEffect(() => { 
    fetchIngredients(); 
    fetchHistory();
    fetchSuppliers(); // --- MỚI
  }, []);

  // --- XỬ LÝ NHẬP NHANH ---
  const handleQuickImport = async () => {
    if (!quickItem.name.trim()) return alert("Vui lòng nhập tên nguyên liệu!");
    if (!quickItem.quantity || parseFloat(quickItem.quantity) <= 0) return alert("Vui lòng nhập số lượng!");
    
    // Validate nợ
    if (quickItem.isDebt && !quickItem.supplierId) return alert("Vui lòng chọn Nhà cung cấp để ghi nợ!");

    try {
      // 1. Tạo nguyên liệu mới
      const createRes = await axios.post('http://localhost:8080/api/admin/ingredients', {
        name: quickItem.name,
        unit: quickItem.unit,
        costPrice: quickItem.costPrice || 0,
        quantity: 0 
      });

      // 2. Gọi API nhập kho (Kèm NCC và Công nợ)
      await axios.post(`http://localhost:8080/api/admin/ingredients/import`, null, {
        params: {
            id: createRes.data.id,
            quantity: quickItem.quantity,
            price: quickItem.costPrice || 0,
            supplierId: quickItem.supplierId || null,
            isPaid: !quickItem.isDebt // Nếu isDebt=true thì isPaid=false
        }
      });

      alert(`Đã nhập kho thành công: ${quickItem.name}`);
      setQuickItem({ name: '', quantity: '', unit: 'kg', costPrice: '', supplierId: '', isDebt: false });
      fetchIngredients();
      fetchHistory();

    } catch (err) {
      console.error(err);
      alert("Lỗi khi nhập hàng mới!");
    }
  };

  // --- XỬ LÝ NHẬP HÀNG CÓ SẴN ---
  const handleImportExisting = (id, costPrice) => {
    const amount = importAmount[id];
    const options = importOptions[id] || { supplierId: '', isDebt: false };

    if(!amount || amount <= 0) return alert("Số lượng không hợp lệ!");
    if (options.isDebt && !options.supplierId) return alert("Vui lòng chọn Nhà cung cấp để ghi nợ!");
    
    axios.post(`http://localhost:8080/api/admin/ingredients/import`, null, {
        params: {
            id: id,
            quantity: amount,
            price: costPrice || 0, // Lấy giá vốn hiện tại làm giá nhập
            supplierId: options.supplierId || null,
            isPaid: !options.isDebt
        }
    })
      .then(() => { 
        alert("Nhập kho thành công!"); 
        setImportAmount({...importAmount, [id]: ''});
        // Reset options
        setImportOptions({...importOptions, [id]: { supplierId: '', isDebt: false }});
        fetchIngredients(); 
        fetchHistory();
      })
      .catch(err => console.error(err));
  };

  // --- CÁC HÀM XỬ LÝ SỬA ---
  const startEdit = (ing) => {
    setEditingId(ing.id);
    setEditForm(ing); 
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = () => {
    axios.put(`http://localhost:8080/api/admin/ingredients/${editingId}`, editForm)
      .then(() => {
        alert("Cập nhật thành công!");
        setEditingId(null);
        fetchIngredients();
      })
      .catch(() => alert("Lỗi cập nhật!"));
  };

  const totalCostToday = importHistory.reduce((sum, item) => sum + item.totalCost, 0);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="admin-title">Quản lý Kho & Nguyên liệu</h1>
      
      {/* --- PHẦN 1: FORM NHẬP NHANH --- */}
      <div className="admin-card mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-md">
        <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2 text-lg">
          ✨ Nhập nguyên liệu mới
        </h3>
        
        <div className="grid grid-cols-5 gap-4 items-end">
          <div className="col-span-2">
            <label className="text-sm font-bold text-gray-600 block mb-1">Tên nguyên liệu <span className="text-red-500">*</span></label>
            <input 
              className="admin-input border-blue-300 focus:ring-blue-200" 
              placeholder="VD: Bột Matcha..."
              value={quickItem.name}
              onChange={e => setQuickItem({...quickItem, name: e.target.value})}
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-600 block mb-1">Số lượng nhập <span className="text-red-500">*</span></label>
            <input 
              type="number"
              className="admin-input border-blue-300 focus:ring-blue-200 font-bold text-blue-700" 
              placeholder="0"
              value={quickItem.quantity}
              onChange={e => setQuickItem({...quickItem, quantity: e.target.value})}
            />
          </div>

          <div>
             <label className="text-sm font-bold text-gray-600 block mb-1">Đơn vị</label>
             <select 
                className="admin-input border-blue-300"
                value={quickItem.unit}
                onChange={e => setQuickItem({...quickItem, unit: e.target.value})}
              >
                <option value="kg">Kg</option>
                <option value="g">Gram</option>
                <option value="lít">Lít</option>
                <option value="chai">Chai</option>
                <option value="lon">Lon</option>
                <option value="thùng">Thùng</option>
                <option value="quả">Quả</option>
              </select>
          </div>

          <button onClick={handleQuickImport} className="admin-btn admin-btn-create h-[42px] w-full shadow-lg">
            📥 Nhập Kho Ngay
          </button>
        </div>
        
        <div className="mt-3 flex gap-4 items-end">
            <div>
                <label className="text-xs font-bold text-gray-500 mr-2">Giá nhập đơn vị (VNĐ):</label>
                <input 
                  type="number" 
                  className="border border-gray-300 rounded px-2 py-1 text-sm w-32 outline-none focus:border-blue-500"
                  placeholder="VD: 25000"
                  value={quickItem.costPrice}
                  onChange={e => setQuickItem({...quickItem, costPrice: e.target.value})}
                />
            </div>

            {/* --- MỚI: CHỌN NCC & GHI NỢ --- */}
            <div>
                <label className="text-xs font-bold text-gray-500 mr-2">Nhà cung cấp:</label>
                <select 
                    className="border border-gray-300 rounded px-2 py-1 text-sm w-40 outline-none"
                    value={quickItem.supplierId}
                    onChange={e => setQuickItem({...quickItem, supplierId: e.target.value})}
                >
                    <option value="">-- Chọn NCC --</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pb-1">
                <input 
                    type="checkbox" 
                    className="w-4 h-4 text-red-600 rounded"
                    checked={quickItem.isDebt}
                    onChange={e => setQuickItem({...quickItem, isDebt: e.target.checked})}
                />
                <span className={`text-sm font-bold ${quickItem.isDebt ? 'text-red-600' : 'text-gray-500'}`}>
                    Ghi nợ
                </span>
            </label>
        </div>
      </div>

      {/* --- PHẦN 2: DANH SÁCH TỒN KHO --- */}
      <h3 className="font-bold text-gray-700 mb-3 text-lg">📦 Kho hàng hiện tại</h3>
      <div className="grid grid-cols-3 gap-6 mb-10">
        {ingredients.map(ing => (
          <div key={ing.id} className={`admin-card relative transition group ${ing.quantity <= 0 ? 'border-2 border-red-500 bg-red-50' : 'border-l-4 border-green-500 hover:shadow-lg'}`}>
            
            {/* --- CHẾ ĐỘ SỬA --- */}
            {editingId === ing.id ? (
              <div className="space-y-3 bg-white p-2 rounded">
                <p className="text-xs font-bold text-blue-600 uppercase">Đang chỉnh sửa:</p>
                <input className="admin-input py-1 text-sm" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                
                <div className="flex gap-2 items-center">
                  <label className="text-xs font-bold">SL:</label>
                  <input type="number" className="admin-input py-1 text-sm w-full font-bold text-red-600" value={editForm.quantity} onChange={e => setEditForm({...editForm, quantity: e.target.value})} />
                  <span className="text-sm">{ing.unit}</span>
                </div>

                <div className="flex gap-2 mt-2">
                  <button onClick={saveEdit} className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold w-full">Lưu</button>
                  <button onClick={cancelEdit} className="bg-gray-400 text-white px-3 py-1 rounded text-xs font-bold w-full">Hủy</button>
                </div>
              </div>
            ) : (
              // --- CHẾ ĐỘ HIỂN THỊ ---
              <>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{ing.name}</h3>
                    <p className="text-gray-500 text-sm">Đơn vị: <span className="font-bold">{ing.unit}</span></p>
                    <p className="text-xs text-gray-400">Giá vốn: {ing.costPrice ? ing.costPrice.toLocaleString() : 0} đ</p>
                  </div>
                  
                  {ing.quantity <= 0 ? (
                    <span className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">HẾT HÀNG</span>
                  ) : (
                    <span className="text-3xl font-extrabold text-green-600">
                      {parseFloat(Number(ing.quantity).toFixed(3))}
                    </span>
                  )}
                </div>

                <button 
                  onClick={() => startEdit(ing)} 
                  className="absolute top-2 right-2 text-gray-400 hover:text-blue-600 hidden group-hover:block bg-white rounded-full p-1 shadow-sm" 
                  title="Sửa thông tin / Kiểm kê kho"
                >
                  ✏️
                </button>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex gap-2 mb-2">
                      <input 
                        type="number" 
                        placeholder="Nhập thêm..." 
                        className="admin-input py-1 text-sm"
                        value={importAmount[ing.id] || ''}
                        onChange={(e) => setImportAmount({...importAmount, [ing.id]: e.target.value})}
                      />
                      <button onClick={() => handleImportExisting(ing.id, ing.costPrice)} className="admin-btn admin-btn-primary whitespace-nowrap text-sm">
                        + Cộng
                      </button>
                  </div>
                  
                  {/* --- MỚI: TÙY CHỌN NCC & NỢ CHO TỪNG MÓN --- */}
                  <div className="flex gap-2 items-center text-xs">
                      <select 
                        className="border rounded px-1 py-0.5 w-24"
                        value={importOptions[ing.id]?.supplierId || ''}
                        onChange={(e) => setImportOptions({
                            ...importOptions, 
                            [ing.id]: { ...importOptions[ing.id], supplierId: e.target.value }
                        })}
                      >
                          <option value="">NCC...</option>
                          {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                      <label className="flex items-center gap-1 cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="w-3 h-3"
                            checked={importOptions[ing.id]?.isDebt || false}
                            onChange={(e) => setImportOptions({
                                ...importOptions, 
                                [ing.id]: { ...importOptions[ing.id], isDebt: e.target.checked }
                            })}
                          />
                          <span className={importOptions[ing.id]?.isDebt ? 'text-red-600 font-bold' : 'text-gray-500'}>Nợ</span>
                      </label>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* --- PHẦN 3: BÁO CÁO --- */}
      <div className="admin-card p-0 overflow-hidden">
        <div className="p-4 bg-gray-800 text-white flex justify-between items-center">
          <h3 className="font-bold text-lg">📋 Lịch sử nhập hàng hôm nay</h3>
          <span className="bg-orange-500 text-white px-4 py-1 rounded-full font-bold text-sm shadow">
            Tổng chi: {totalCostToday.toLocaleString()} đ
          </span>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Tên nguyên liệu</th>
              <th>Số lượng nhập</th>
              <th>Đơn vị</th>
              <th>Thành tiền</th>
              <th>Thanh toán</th> {/* --- MỚI --- */}
            </tr>
          </thead>
          <tbody>
            {importHistory.map((item) => (
              <tr key={item.id}>
                <td className="text-gray-500 text-sm">
                  {new Date(item.importTime).toLocaleTimeString()}
                </td>
                <td className="font-bold text-gray-700">{item.ingredientName}</td>
                <td className="font-bold text-green-600">+{item.quantity}</td>
                <td>{item.unit}</td>
                <td className="font-bold text-red-500">
                  {item.totalCost.toLocaleString()} đ
                </td>
                <td className="text-center">
                    {item.isPaidDebt ? (
                        <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded font-bold">Tiền mặt</span>
                    ) : (
                        <span className="text-red-600 text-xs bg-red-100 px-2 py-1 rounded font-bold">Ghi nợ</span>
                    )}
                </td>
              </tr>
            ))}
            
            {importHistory.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-400 italic">
                  Hôm nay chưa nhập đơn hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default IngredientManager;