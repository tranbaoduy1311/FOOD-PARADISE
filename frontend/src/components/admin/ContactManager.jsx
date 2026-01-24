import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ContactManager = () => {
  const [messages, setMessages] = useState([]);

  const fetchMessages = () => {
    axios.get('/api/contact')
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleDelete = (id) => {
    if (window.confirm("Xóa tin nhắn này?")) {
      axios.delete(`/api/contact/${id}`).then(() => fetchMessages());
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="admin-title">Hộp thư góp ý</h1>
      <p className="admin-subtitle">Xem phản hồi và yêu cầu từ khách hàng</p>

      <div className="grid grid-cols-1 gap-6 mt-8">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-orange-500 relative group">
            <button 
              onClick={() => handleDelete(msg.id)}
              className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition"
            >
              🗑️ Xóa
            </button>
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{msg.subject || "Không có chủ đề"}</h3>
                <p className="text-sm text-gray-400">{new Date(msg.createdAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-orange-600">{msg.name}</p>
                <p className="text-xs text-gray-500">{msg.email} | {msg.phone}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl text-gray-700 italic">
              "{msg.message}"
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-20 text-gray-400">Hộp thư hiện đang trống.</div>
        )}
      </div>
    </div>
  );
};

export default ContactManager;