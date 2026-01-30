import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuditLogManager = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/admin/audit-logs')
      .then(res => setLogs(res.data))
      .catch(err => console.error(err));
  }, []);

  const getActionColor = (action) => {
    if (action.includes('DELETE')) return 'text-red-600 bg-red-50';
    if (action.includes('IMPORT')) return 'text-green-600 bg-green-50';
    if (action.includes('UPDATE')) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="admin-title">Nhật ký hoạt động hệ thống</h1>
      <p className="admin-subtitle">Theo dõi mọi thao tác quan trọng để bảo mật</p>

      <div className="admin-card p-0 overflow-hidden mt-6">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Người thực hiện</th>
              <th>Hành động</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-gray-50">
                <td className="text-sm text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="font-bold">{log.actor}</td>
                <td>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getActionColor(log.action)}`}>
                    {log.action}
                  </span>
                </td>
                <td className="text-gray-700">{log.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {logs.length === 0 && (
          <div className="p-8 text-center text-gray-400">Chưa có nhật ký nào.</div>
        )}
      </div>
    </div>
  );
};

export default AuditLogManager;