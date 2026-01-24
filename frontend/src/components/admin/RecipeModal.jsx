import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecipeModal = ({ product, onClose }) => {
  const [allIngredients, setAllIngredients] = useState([]); 
  const [recipe, setRecipe] = useState([]); 
  
  const [selectedIngId, setSelectedIngId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  useEffect(() => {
    // Lấy danh sách kho
    axios.get('http://localhost:8080/api/admin/ingredients')
      .then(res => setAllIngredients(res.data))
      .catch(err => console.error(err));

    // Lấy công thức hiện tại
    axios.get(`http://localhost:8080/api/recipes/${product.id}`)
      .then(res => setRecipe(res.data))
      .catch(err => console.error(err));
  }, [product.id]);

  // --- HÀM GỌI AI ---
  const handleAskAI = () => {
    if(recipe.length > 0) {
      if(!window.confirm("Danh sách hiện tại sẽ bị ghi đè. Tiếp tục?")) return;
    }

    setIsLoadingAI(true);
    axios.get(`http://localhost:8080/api/ai/suggest-recipe?dishName=${product.name}`)
      .then(res => {
        const aiSuggestions = res.data; 
        
        // --- KIỂM TRA DỮ LIỆU TRẢ VỀ ---
        if (!Array.isArray(aiSuggestions)) {
            alert("AI trả về dữ liệu không đúng định dạng hoặc bị lỗi. Vui lòng thử lại!");
            setIsLoadingAI(false);
            return;
        }
        // ------------------------------

        const mappedRecipe = aiSuggestions.map(aiItem => {
          // Tìm xem nguyên liệu AI gợi ý có trong kho chưa (So sánh tên gần đúng)
          const foundInDb = allIngredients.find(ing => 
            ing.name.toLowerCase().includes(aiItem.name.toLowerCase()) || 
            aiItem.name.toLowerCase().includes(ing.name.toLowerCase())
          );

          if (foundInDb) {
            return { ingredient: foundInDb, quantityRequired: aiItem.quantity };
          } else {
            // Nếu chưa có, tạo đối tượng tạm với id = null để đánh dấu là "Mới"
            return {
              ingredient: { id: null, name: aiItem.name + " (Mới)", unit: aiItem.unit },
              quantityRequired: aiItem.quantity
            };
          }
        });
        
        setRecipe(mappedRecipe);
        setIsLoadingAI(false);
      })
      .catch(err => {
        console.error(err);
        alert("Lỗi gọi AI hoặc AI đang bận! Hãy kiểm tra lại API Key hoặc thử lại sau.");
        setIsLoadingAI(false);
      });
  };

  // Thêm thủ công
  const handleAdd = () => {
    if (!selectedIngId || !quantity) return;
    const ing = allIngredients.find(i => i.id === parseInt(selectedIngId));
    if (ing) {
      setRecipe([...recipe, { ingredient: ing, quantityRequired: parseFloat(quantity) }]);
      setQuantity("");
    }
  };

  const handleRemove = (index) => {
    const newRecipe = [...recipe];
    newRecipe.splice(index, 1);
    setRecipe(newRecipe);
  };

  const handleSave = () => {
    // Kiểm tra dữ liệu hợp lệ: Không cho lưu nếu có nguyên liệu "Mới" chưa được tạo trong kho
    const invalidItems = recipe.filter(r => !r.ingredient || r.ingredient.id === null);
    if (invalidItems.length > 0) {
      return alert(`Vui lòng tạo các nguyên liệu mới này trong kho trước khi lưu công thức: \n- ${invalidItems.map(i => i.ingredient?.name).join("\n- ")}`);
    }

    axios.post(`http://localhost:8080/api/recipes/${product.id}`, recipe)
      .then(() => { alert("Đã lưu công thức thành công!"); onClose(); })
      .catch(err => {
        console.error(err);
        alert("Lỗi khi lưu! Vui lòng kiểm tra lại console.");
      });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[700px] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h3 className="font-bold text-lg">Công thức: {product.name}</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200 font-bold text-xl">✖</button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          
          {/* Nút gọi AI */}
          <div className="mb-6 flex justify-center">
            <button 
              onClick={handleAskAI}
              disabled={isLoadingAI}
              className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition flex items-center justify-center gap-2
                ${isLoadingAI ? 'bg-gray-400 cursor-wait' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-[1.02]'}`}
            >
              {isLoadingAI ? "🤖 AI đang suy nghĩ..." : "✨ Dùng AI gợi ý công thức tự động"}
            </button>
          </div>

          {/* Form thêm thủ công */}
          <div className="flex gap-2 mb-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="flex-1">
              <label className="text-xs font-bold text-gray-500">Chọn từ kho</label>
              <select className="admin-input w-full p-2 border rounded" value={selectedIngId} onChange={e => setSelectedIngId(e.target.value)}>
                <option value="">-- Chọn nguyên liệu --</option>
                {allIngredients.map(ing => (<option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>))}
              </select>
            </div>
            <div className="w-24">
              <label className="text-xs font-bold text-gray-500">Định lượng</label>
              <input type="number" className="admin-input w-full p-2 border rounded" placeholder="0.0" value={quantity} onChange={e => setQuantity(e.target.value)} />
            </div>
            <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-bold">+ Thêm</button>
          </div>

          {/* Bảng danh sách công thức */}
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
                <tr>
                    <th className="p-3 border-b">Tên nguyên liệu</th>
                    <th className="p-3 border-b">Định lượng</th>
                    <th className="p-3 border-b">Đơn vị</th>
                    <th className="p-3 border-b text-center">Xóa</th>
                </tr>
            </thead>
            <tbody>
              {recipe.map((item, index) => (
                <tr key={index} className={`border-b hover:bg-gray-50 ${item.ingredient?.id === null ? "bg-yellow-50" : ""}`}>
                  <td className="p-3 font-bold text-gray-700">
                    {item.ingredient?.name || "Lỗi dữ liệu"}
                    {item.ingredient?.id === null && <span className="text-red-500 text-xs ml-2 italic">(Chưa có trong kho)</span>}
                  </td>
                  <td className="p-3 text-blue-600 font-bold">{item.quantityRequired}</td>
                  <td className="p-3 text-gray-500">{item.ingredient?.unit || "-"}</td>
                  <td className="p-3 text-center">
                      <button onClick={() => handleRemove(index)} className="text-red-500 font-bold hover:bg-red-100 px-2 rounded">✖</button>
                  </td>
                </tr>
              ))}
              {recipe.length === 0 && (
                  <tr>
                      <td colSpan="4" className="p-4 text-center text-gray-400 italic">Chưa có thành phần nào.</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t bg-gray-50 text-right">
          <button onClick={handleSave} className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 shadow-md">💾 Lưu Công Thức</button>
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;