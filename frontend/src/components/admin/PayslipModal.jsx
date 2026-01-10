import React from 'react';

const PayslipModal = ({ payroll, onClose }) => {
  if (!payroll) return null;

  // Tính số ngày nghỉ để hiển thị
  const standardDays = payroll.standardWorkDays || 26;
  const daysOff = standardDays - payroll.totalWorkDays;
  const displayDaysOff = daysOff > 0 ? daysOff : 0;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white w-[650px] p-8 rounded-lg shadow-xl relative print:w-full print:h-full print:fixed print:top-0 print:left-0 print:rounded-none">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-red-500 print:hidden">✖ Đóng</button>

        <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
            <h1 className="text-3xl font-bold uppercase">Phiếu Lương Nhân Viên</h1>
            <p className="text-gray-600 mt-1">Tháng {payroll.month} / {payroll.year}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
                <p className="text-gray-500 text-sm">Nhân viên:</p>
                <p className="font-bold text-lg">{payroll.employeeName}</p>
                <p className="text-sm text-gray-500">Mã NV: NV-{payroll.employeeId}</p>
            </div>
            <div className="text-right">
                <p className="text-gray-500 text-sm">Loại lương:</p>
                <span className="font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {payroll.salaryType === 'MONTHLY' ? 'Full-time (Theo tháng)' : 'Part-time (Theo giờ)'}
                </span>
            </div>
        </div>

        <table className="w-full mb-6 border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-100">
                <tr>
                    <th className="border p-2 text-left">Khoản mục</th>
                    <th className="border p-2 text-center">Chi tiết</th>
                    <th className="border p-2 text-right">Thành tiền</th>
                </tr>
            </thead>
            <tbody>
                {/* 1. LƯƠNG CƠ BẢN */}
                <tr>
                    <td className="border p-2 font-bold">1. Lương cơ bản / Định mức</td>
                    <td className="border p-2 text-center">
                        {payroll.salaryType === 'MONTHLY' ? `${standardDays} công chuẩn` : 'Theo giờ làm'}
                    </td>
                    <td className="border p-2 text-right font-bold">{payroll.baseSalary?.toLocaleString()} đ</td>
                </tr>

                {/* 2. TRỪ NGÀY NGHỈ (Chỉ hiện với Full-time) */}
                {payroll.salaryType === 'MONTHLY' && (
                    <tr className="text-red-600 bg-red-50">
                        <td className="border p-2">2. Trừ ngày nghỉ không lương</td>
                        <td className="border p-2 text-center">
                            Nghỉ {displayDaysOff} ngày
                            <br/>
                            <span className="text-xs text-gray-500">(Đi làm: {payroll.totalWorkDays}/{standardDays})</span>
                        </td>
                        <td className="border p-2 text-right">- {payroll.deduction?.toLocaleString()} đ</td>
                    </tr>
                )}

                {/* 3. CỘNG TĂNG CA */}
                <tr className="text-green-700 bg-green-50">
                    <td className="border p-2">3. Lương tăng ca (Overtime)</td>
                    <td className="border p-2 text-center">{payroll.overtimeHours} giờ (x1.5)</td>
                    <td className="border p-2 text-right">+ {payroll.bonus?.toLocaleString()} đ</td>
                </tr>

                {/* 4. PART-TIME: CÔNG THỰC TẾ */}
                {payroll.salaryType === 'HOURLY' && (
                    <tr>
                        <td className="border p-2">4. Tổng giờ làm việc</td>
                        <td className="border p-2 text-center">{payroll.totalWorkHours} giờ</td>
                        <td className="border p-2 text-right italic text-gray-500">(Đã tính vào tổng)</td>
                    </tr>
                )}
            </tbody>
        </table>

        <div className="flex justify-end items-center border-t-2 border-gray-800 pt-4">
            <div className="text-right">
                <p className="text-lg font-bold text-gray-600">THỰC LĨNH:</p>
                <p className="text-4xl font-extrabold text-blue-800">{payroll.totalSalary?.toLocaleString()} đ</p>
            </div>
        </div>

        <div className="mt-8 text-center print:hidden">
            <button 
                onClick={() => window.print()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 shadow-lg flex items-center justify-center gap-2 mx-auto"
            >
                🖨️ IN PHIẾU LƯƠNG
            </button>
        </div>

      </div>
    </div>
  );
};

export default PayslipModal;