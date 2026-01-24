import React, { useState } from 'react';
import axios from 'axios';

const PosLogin = ({ onLoginSuccess }) => {
  const [code, setCode] = useState("");
  const [shift, setShift] = useState("Sáng");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    if (!code) return setError("Vui lòng nhập mã nhân viên!");

    axios.post(`/api/auth/login-pos?code=${code}`)
      .then(res => {
        onLoginSuccess({ ...res.data, shift: shift });
      })
      .catch(err => {
        console.error(err);
        setError("Mã nhân viên không đúng!");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96">
        <h1 className="text-3xl font-extrabold text-blue-600 text-center mb-6">POS LOGIN</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Mã nhân viên</label>
            <input type="text" className="w-full p-3 border rounded-xl font-bold uppercase" placeholder="VD: NV01" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
          </div>
          <div>
            <label className="block font-bold text-gray-700 mb-1">Ca làm việc</label>
            <select className="w-full p-3 border rounded-xl" value={shift} onChange={(e) => setShift(e.target.value)}>
              <option value="Sáng">☀️ Ca Sáng</option>
              <option value="Chiều">⛅ Ca Chiều</option>
              <option value="Đêm">🌙 Ca Đêm</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm font-bold text-center">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl">VÀO CA LÀM VIỆC</button>
        </form>
      </div>
    </div>
  );
};

export default PosLogin;