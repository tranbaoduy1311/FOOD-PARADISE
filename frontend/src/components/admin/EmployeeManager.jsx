import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeManager = () => {
  const [employees, setEmployees] = useState([]);
  
  // 1. Cấu hình lương gợi ý theo chức vụ (Smart-Fill)
  const SUGGESTED_SALARY = {
    STAFF: { monthly: 6000000, hourly: 22000 },
    CHEF: { monthly: 12000000, hourly: 45000 },
    ADMIN: { monthly: 18000000, hourly: 60000 }
  };

  // State quản lý Form
  const [form, setForm] = useState({ 
    employeeCode: '', 
    name: '', 
    role: 'STAFF', 
    phone: '', 
    salary: 6000000,
    salaryType: 'MONTHLY',
    hourlyRate: 0
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Lấy danh sách nhân viên từ Backend
// Cập nhật hàm fetchEmployees để kiểm tra lỗi
  const fetchEmployees = () => {
    console.log("Đang gọi API lấy danh sách nhân viên...");
    axios.get('http://localhost:8080/api/admin/employees')
      .then(res => {
        console.log("Dữ liệu nhận được từ Backend:", res.data);
        // Đảm bảo res.data là một mảng, nếu không thì để mảng rỗng
        setEmployees(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error("Lỗi khi gọi API GET:", err);
        alert("Không thể tải danh sách nhân viên. Hãy kiểm tra Console (F12)");
      });
  };



  useEffect(() => { fetchEmployees(); }, []);

  // 2. Xử lý khi đổi chức vụ -> Tự động gợi ý lương
  const handleRoleChange = (newRole) => {
    const suggested = SUGGESTED_SALARY[newRole];
    setForm({
      ...form,
      role: newRole,
      salary: form.salaryType === 'MONTHLY' ? suggested.monthly : 0,
      hourlyRate: form.salaryType === 'HOURLY' ? suggested.hourly : 0
    });
  };

  // 3. Xử lý khi đổi loại lương (Tháng/Giờ)
  const handleTypeChange = (newType) => {
    const suggested = SUGGESTED_SALARY[form.role];
    setForm({
      ...form,
      salaryType: newType,
      salary: newType === 'MONTHLY' ? suggested.monthly : 0,
      hourlyRate: newType === 'HOURLY' ? suggested.hourly : 0
    });
  };

  // 4. Xử lý Lưu (Thêm mới hoặc Cập nhật)
  const handleSave = () => {
    if (!form.employeeCode || !form.name) return alert("Vui lòng nhập Mã NV và Họ tên!");
    
    // Chặn số âm trước khi gửi lên Server
    if (form.salary < 0 || form.hourlyRate < 0) {
        alert("Lương không được là số âm!");
        return;
    }

    const apiCall = isEditing 
      ? axios.put(`http://localhost:8080/api/admin/employees/${editingId}`, form)
      : axios.post('http://localhost:8080/api/admin/employees', form);

    apiCall.then(() => {
      alert(isEditing ? "Cập nhật thành công!" : "Thêm mới thành công!");
      resetForm();
      fetchEmployees();
    }).catch(err => {
      alert(err.response?.data || "Lỗi xử lý dữ liệu!");
    });
  };

  // 5. Xử lý Xóa nhân viên (Đã thêm lại)
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhân viên này?")) {
      axios.delete(`http://localhost:8080/api/admin/employees/${id}`)
        .then(() => {
          alert("Đã xóa nhân viên thành công!");
          fetchEmployees();
        })
        .catch(err => {
          // Thông báo lỗi nếu nhân viên đã có dữ liệu liên quan (chấm công, hóa đơn)
          alert(err.response?.data || "Không thể xóa nhân viên này do ràng buộc dữ liệu!");
        });
    }
  };

  // 6. Chuẩn bị Form để sửa
  const handleEditClick = (emp) => {
    setForm({ ...emp });
    setIsEditing(true);
    setEditingId(emp.id);
  };

  // Reset Form về trạng thái ban đầu
  const resetForm = () => {
    setForm({ 
        employeeCode: '', 
        name: '', 
        role: 'STAFF', 
        phone: '', 
        salary: 6000000, 
        salaryType: 'MONTHLY', 
        hourlyRate: 0 
    });
    setIsEditing(false);
    setEditingId(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="admin-title">Quản lý Nhân sự</h1>
      
      {/* --- FORM NHẬP LIỆU --- */}
      <div className={`admin-card mb-6 border-l-4 shadow-lg transition-all ${isEditing ? 'border-yellow-500 bg-yellow-50' : 'border-blue-500'}`}>
        <h3 className="font-bold text-gray-700 mb-4 flex justify-between items-center">
          {isEditing ? "✏️ Chỉnh sửa thông tin nhân viên" : "✨ Thêm nhân viên mới"}
          {isEditing && (
            <button onClick={resetForm} className="text-red-500 text-sm font-bold hover:underline">
              Hủy chỉnh sửa
            </button>
          )}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Mã NV</label>
            <input 
                className="admin-input" 
                placeholder="NV01"
                value={form.employeeCode} 
                onChange={e => setForm({...form, employeeCode: e.target.value})} 
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Họ tên</label>
            <input 
                className="admin-input" 
                placeholder="Nguyễn Văn A"
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Chức vụ</label>
            <select className="admin-input" value={form.role} onChange={e => handleRoleChange(e.target.value)}>
              <option value="STAFF">Phục vụ</option>
              <option value="CHEF">Đầu bếp</option>
              <option value="ADMIN">Quản lý</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Loại lương</label>
            <select className="admin-input" value={form.salaryType} onChange={e => handleTypeChange(e.target.value)}>
              <option value="MONTHLY">Full-time (Tháng)</option>
              <option value="HOURLY">Part-time (Giờ)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">
              {form.salaryType === 'MONTHLY' ? 'Lương tháng' : 'Lương/Giờ'}
            </label>
            <input 
              type="number" 
              min="0"
              className="admin-input font-bold text-blue-600" 
              value={form.salaryType === 'MONTHLY' ? form.salary : form.hourlyRate} 
              onChange={e => setForm({
                ...form, 
                [form.salaryType === 'MONTHLY' ? 'salary' : 'hourlyRate']: parseFloat(e.target.value) || 0
              })} 
            />
          </div>

          <button 
            onClick={handleSave} 
            className={`admin-btn h-10 shadow-md font-bold ${isEditing ? 'bg-yellow-500 text-white border-none hover:bg-yellow-600' : 'admin-btn-create'}`}
          >
            {isEditing ? "Cập nhật" : "+ Thêm mới"}
          </button>
        </div>
      </div>

      {/* --- BẢNG DANH SÁCH NHÂN VIÊN --- */}
      <div className="admin-card p-0 overflow-hidden shadow-xl border border-gray-200">
        <table className="admin-table">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th>Mã NV</th>
              <th>Họ tên</th>
              <th>Chức vụ</th>
              <th>Hình thức</th>
              <th>Mức lương</th>
              <th className="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(e => (
              <tr key={e.id} className={`hover:bg-gray-50 transition-colors ${editingId === e.id ? "bg-yellow-100" : ""}`}>
                <td className="font-bold text-blue-600">{e.employeeCode}</td>
                <td className="font-bold text-gray-800">{e.name}</td>
                <td>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        e.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 
                        e.role === 'CHEF' ? 'bg-orange-100 text-orange-700' : 
                        'bg-blue-100 text-blue-700'
                    }`}>
                        {e.role}
                    </span>
                </td>
                <td className="text-sm text-gray-600">
                    {e.salaryType === 'MONTHLY' ? '📅 Full-time' : '⏱️ Part-time'}
                </td>
                <td className="font-bold text-green-600">
                  {e.salaryType === 'MONTHLY' 
                    ? `${e.salary?.toLocaleString()} đ/tháng` 
                    : `${e.hourlyRate?.toLocaleString()} đ/giờ`}
                </td>
                <td className="text-center">
                  <div className="flex justify-center gap-4">
                    <button 
                        onClick={() => handleEditClick(e)} 
                        className="text-blue-600 font-bold hover:text-blue-800 hover:underline"
                    >
                        Sửa
                    </button>
                    <button 
                        onClick={() => handleDelete(e.id)} 
                        className="text-red-600 font-bold hover:text-red-800 hover:underline"
                    >
                        Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
                <tr>
                    <td colSpan="6" className="text-center p-10 text-gray-400 italic">
                        Chưa có nhân viên nào trong danh sách.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeManager;