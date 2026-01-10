import React, { useState, useRef, useEffect } from 'react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Xin chào! 👋 Tôi là trợ lý ảo của Food Paradise. Bạn cần giúp gì không?' }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    // 1. Hiện tin nhắn người dùng ngay lập tức
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput("");
    setIsTyping(true);

    // --- CẤU HÌNH GỌI TRỰC TIẾP GOOGLE ---
    // Key lấy chính xác từ ảnh bạn gửi
    const API_KEY = "AlzaSyC4UOi5nla3ZV5CzmA7ECEJuqH-bQ3hwJQ"; 
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    // Kịch bản cho nhân viên ảo
    const systemPrompt = "Bạn là nhân viên phục vụ ảo của nhà hàng 'Food Paradise'. "
        + "Phong cách: Thân thiện, hài hước, dùng nhiều emoji. "
        + "Thông tin quán: Mở cửa 8h-22h. Địa chỉ: 123 Quận 1, TP.HCM. "
        + "Menu nổi bật: Cơm tấm, Phở bò, Trà sữa. "
        + "Nhiệm vụ: Trả lời câu hỏi của khách hàng ngắn gọn (dưới 100 từ).";

    try {
      // 2. Gọi trực tiếp sang Google bằng fetch (tránh lỗi axios/backend)
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: systemPrompt + "\nKhách hỏi: " + userMsg }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Lỗi kết nối: ${response.status}`);
      }

      const data = await response.json();

      // 3. Lấy câu trả lời từ Google
      if (data.candidates && data.candidates.length > 0) {
          const aiResponse = data.candidates[0].content.parts[0].text;
          setMessages(prev => [...prev, { sender: 'bot', text: aiResponse }]);
      } else {
          setMessages(prev => [...prev, { sender: 'bot', text: "Xin lỗi, tôi chưa hiểu ý bạn lắm 🤔" }]);
      }

    } catch (error) {
      console.error("Lỗi gọi AI:", error);
      setMessages(prev => [...prev, { sender: 'bot', text: "Hệ thống đang bận, bạn thử lại sau nhé! 😔" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Cửa sổ Chat */}
      {isOpen && (
        <div className="bg-white w-80 h-96 rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden mb-4 animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              <div>
                <h3 className="font-bold text-sm">Trợ lý Food Paradise</h3>
                <p className="text-xs opacity-80">Luôn sẵn sàng hỗ trợ</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 rounded-full p-1">✖</button>
          </div>

          {/* Nội dung tin nhắn */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 p-2 rounded-xl rounded-bl-none text-xs text-gray-500 italic animate-pulse">
                  Đang soạn tin...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Ô nhập liệu */}
          <div className="p-3 bg-white border-t flex gap-2">
            <input 
              type="text" 
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-orange-500"
              placeholder="Hỏi gì đó..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Nút tròn mở Chat */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-orange-500 to-red-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-3xl hover:scale-110 transition-transform duration-300"
      >
        {isOpen ? '⬇' : '💬'}
      </button>
    </div>
  );
};

export default ChatWidget;