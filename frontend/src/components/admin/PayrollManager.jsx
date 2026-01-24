import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PayslipModal from './PayslipModal';

const PayrollManager = () => {
    const [payrolls, setPayrolls] = useState([]);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [loading, setLoading] = useState(false);
    const [selectedPayroll, setSelectedPayroll] = useState(null);

    // Tạo danh sách năm động (Ví dụ: từ 2024 đến năm hiện tại + 1)
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 2024; i <= currentYear + 1; i++) {
        years.push(i);
    }

    const fetchPayrolls = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/admin/payrolls?month=${month}&year=${year}`);
            setPayrolls(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchPayrolls();
    }, [month, year]);

    const handleCalculate = async () => {
        if(!window.confirm(`Bạn có chắc muốn tính lương tháng ${month}/${year}? Dữ liệu cũ sẽ bị ghi đè.`)) return;
        
        setLoading(true);
        try {
            const res = await axios.post(`http://localhost:8080/api/admin/payrolls/calculate?month=${month}&year=${year}`);
            setPayrolls(res.data);
            alert("Tính lương thành công!");
        } catch (error) {
            console.error(error);
            alert("Lỗi khi tính lương");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">💰 Quản Lý Lương Nhân Viên</h1>
                
                <div className="flex gap-3 items-center bg-white p-2 rounded shadow">
                    {/* Chọn Tháng */}
                    <select value={month} onChange={e => setMonth(e.target.value)} className="border p-1 rounded">
                        {[...Array(12)].map((_, i) => <option key={i} value={i+1}>Tháng {i+1}</option>)}
                    </select>

                    {/* Chọn Năm - ĐÃ SỬA THÀNH DỰNG ĐỘNG */}
                    <select value={year} onChange={e => setYear(parseInt(e.target.value))} className="border p-1 rounded">
                        {years.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>

                    <button 
                        onClick={handleCalculate}
                        disabled={loading}
                        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 font-bold disabled:opacity-50"
                    >
                        {loading ? "Đang tính..." : "⚡ Tính Lương"}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
                        <tr>
                            <th className="p-3 border">Nhân viên</th>
                            <th className="p-3 border">Loại lương</th>
                            <th className="p-3 border text-center">Công / Giờ</th>
                            <th className="p-3 border text-center">Tăng ca</th>
                            <th className="p-3 border text-right">Tổng Lương</th>
                            <th className="p-3 border text-center">Trạng thái</th>
                            <th className="p-3 border text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payrolls.length === 0 ? (
                            <tr><td colSpan="7" className="p-4 text-center text-gray-500">Chưa có dữ liệu lương tháng này.</td></tr>
                        ) : (
                            payrolls.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50 border-b">
                                    <td className="p-3 font-bold">{p.employeeName}</td>
                                    <td className="p-3 text-sm">{p.salaryType === 'MONTHLY' ? 'Full-time' : 'Part-time'}</td>
                                    <td className="p-3 text-center">{p.totalWorkDays} ngày ({p.totalWorkHours}h)</td>
                                    <td className="p-3 text-center text-orange-600">{p.overtimeHours}h</td>
                                    <td className="p-3 text-right font-bold text-blue-700">{p.totalSalary.toLocaleString()} đ</td>
                                    <td className="p-3 text-center">
                                        <span className={`px-2 py-1 rounded text-xs ${p.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {p.status === 'PAID' ? 'Đã trả' : 'Chờ duyệt'}
                                        </span>
                                    </td>
                                    <td className="p-3 text-center">
                                        <button 
                                            onClick={() => setSelectedPayroll(p)}
                                            className="text-blue-600 hover:underline font-bold"
                                        >
                                            🖨️ In Phiếu
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal In Phiếu Lương */}
            {selectedPayroll && (
                <PayslipModal 
                    payroll={selectedPayroll} 
                    onClose={() => setSelectedPayroll(null)} 
                />
            )}
        </div>
    );
};

export default PayrollManager;