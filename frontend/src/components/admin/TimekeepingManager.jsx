import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TimekeepingManager = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [workingStatus, setWorkingStatus] = useState({});

  // --- 1. ĐỊNH NGHĨA HÀM LẤY DỮ LIỆU ---
  const fetchData = async () => {
    try {
      // Lấy danh sách nhân viên
      const empRes = await axios.get('/api/admin/employees');
      setEmployees(empRes.data);

      // Lấy lịch sử chấm công
      const attRes = await axios.get('/api/attendance');
      setAttendanceHistory(attRes.data);

      // Xác định ai đang làm việc
      const statusMap = {};
      attRes.data.forEach(att => {
        if (att.status === 'WORKING') {
          statusMap[att.employeeId] = true;
        }
      });
      setWorkingStatus(statusMap);

    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    }
  };

  // --- 2. GỌI HÀM TRONG useEffect (CHẠY 1 LẦN) ---
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Mảng rỗng để chỉ chạy 1 lần khi vào trang

  // Xử lý Check-in
  const handleCheckIn = (empId) => {
    axios.post(`/api/attendance/check-in?employeeId=${empId}`)
      .then(() => {
        alert("✅ Check-in thành công!");
        fetchData();
      })
      .catch(err => {
        console.error(err); // Sửa lỗi 'err' bằng cách in nó ra
        alert(err.response?.data?.message || "Lỗi Check-in");
      });
  };

  // Xử lý Check-out
  const handleCheckOut = (empId) => {
    const ot = prompt("Nhập số giờ tăng ca (nếu có, mặc định 0):", "0");
    if (ot === null) return; 

    axios.post(`/api/attendance/check-out?employeeId=${empId}&overtime=${ot}`)
      .then(() => {
        alert("👋 Check-out thành công!");
        fetchData();
      })
      .catch(err => {
        console.error(err); // Sửa lỗi 'err' bằng cách in nó ra
        alert("Lỗi Check-out");
      });
  };

  const calculateDuration = (start, end) => {
    if (!start || !end) return "---";
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime - startTime;
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
    return `${diffHrs}h ${diffMins}p`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="admin-title">Quản lý Chấm công & Tăng ca</h1>

      {/* --- TRẠNG THÁI NHÂN VIÊN --- */}
      <div className="admin-card mb-8">
        <h3 className="font-bold text-gray-700 mb-4">Trạng thái nhân viên hiện tại</h3>
        <div className="grid grid-cols-4 gap-4">
          {employees.map(emp => {
            const isWorking = workingStatus[emp.id];
            return (
              <div key={emp.id} className={`p-4 rounded-xl border-2 flex flex-col items-center transition-all ${
                isWorking ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50 opacity-70'
              }`}>
                <div className={`w-3 h-3 rounded-full mb-2 ${isWorking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                <h4 className="font-bold text-gray-800">{emp.name}</h4>
                <p className="text-xs text-gray-500 mb-3">{emp.employeeCode} - {emp.role}</p>
                
                {isWorking ? (
                  <button 
                    onClick={() => handleCheckOut(emp.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold hover:bg-red-600"
                  >
                    Check Out
                  </button>
                ) : (
                  <button 
                    onClick={() => handleCheckIn(emp.id)}
                    className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold hover:bg-blue-600"
                  >
                    Check In
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* --- LỊCH SỬ CHẤM CÔNG --- */}
      <div className="admin-card p-0 overflow-hidden">
        <div className="p-4 border-b bg-gray-50 font-bold text-gray-700">Lịch sử làm việc gần đây</div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Mã NV</th>
              <th>Nhân viên</th>
              <th>Giờ vào</th>
              <th>Giờ ra</th>
              <th>Tổng giờ</th>
              <th>Tăng ca</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {attendanceHistory.map(att => (
              <tr key={att.id}>
                <td>{att.workDate}</td>
                <td className="font-bold text-gray-500">{att.employeeCode}</td>
                <td className="font-bold">{att.employeeName}</td>
                <td className="text-green-600 font-medium">
                  {new Date(att.checkIn).toLocaleTimeString()}
                </td>
                <td className="text-red-600 font-medium">
                  {att.checkOut ? new Date(att.checkOut).toLocaleTimeString() : "---"}
                </td>
                <td className="font-bold">
                  {calculateDuration(att.checkIn, att.checkOut)}
                </td>
                <td>
                  {att.overtimeHours > 0 ? (
                    <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">
                      +{att.overtimeHours}h
                    </span>
                  ) : "-"}
                </td>
                <td>
                  <span className={`admin-badge ${att.status === 'WORKING' ? 'admin-badge-success' : 'bg-gray-200 text-gray-600'}`}>
                    {att.status === 'WORKING' ? 'Đang làm' : 'Đã về'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimekeepingManager;