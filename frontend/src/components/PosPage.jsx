import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import '../styles/pos.css';
import PosLogin from './PosLogin';
import PosOrderInterface from './PosOrderInterface'; // Import component mới

const PosPage = () => {
  // --- 1. KHỞI TẠO STATE ---
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem('pos_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [view, setView] = useState('TABLE_MAP');
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  
  // State cho giao diện gọi món (Truyền xuống con)
  const [activeCategory, setActiveCategory] = useState('ALL'); 
  const [productSearch, setProductSearch] = useState(""); 
  const [kitchenNote, setKitchenNote] = useState("");
  const [customer, setCustomer] = useState(null); 
  const [phoneSearch, setPhoneSearch] = useState(""); 
  const [pointsToUse, setPointsToUse] = useState(0); 
  const [voucherCode, setVoucherCode] = useState("");

  const [reservations, setReservations] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null); 
  const [orderDetails, setOrderDetails] = useState([]);
  
  const [showTableModal, setShowTableModal] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState("");

  const [filterStatus, setFilterStatus] = useState('ALL'); 
  const [activeOrdersMap, setActiveOrdersMap] = useState({}); 
  const [availableVouchers, setAvailableVouchers] = useState([]); 

  // --- 2. CÁC HÀM API ---
  const fetchAllActiveOrders = useCallback(async (currentTables) => {
    try {
      const listToUse = currentTables || tables;
      const busyTables = listToUse.filter(t => t.status === 'Có khách');
      const ordersMap = {};
      for (const table of busyTables) {
        const res = await axios.get(`http://localhost:8080/api/orders/table/${table.id}`);
        if (res.data) {
          ordersMap[table.id] = {
            total: res.data.totalPrice,
            startTime: res.data.createdAt 
          };
        }
      }
      setActiveOrdersMap(ordersMap);
    } catch (err) { console.error(err); }
  }, [tables]);

  const fetchTables = useCallback(() => {
    axios.get('http://localhost:8080/api/tables')
      .then(res => {
        setTables(res.data);
        fetchAllActiveOrders(res.data); 
      })
      .catch(err => console.error(err));
  }, [fetchAllActiveOrders]);

  const fetchProducts = async () => {
    try {
        const res = await axios.get('http://localhost:8080/api/products');
        setProducts(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchCategories = async () => {
    try {
        const res = await axios.get('http://localhost:8080/api/categories');
        setCategories(res.data);
    } catch (err) { console.error(err); }
  };
  
  const fetchVouchers = async () => {
    try {
        const res = await axios.get('http://localhost:8080/api/orders/promotions/active');
        setAvailableVouchers(res.data);
    } catch (error) { console.error("Lỗi tải voucher", error); }
  };

  const fetchReservations = useCallback(() => {
    axios.get('http://localhost:8080/api/reservations')
      .then(res => {
        const pending = res.data.filter(r => r.status === 'PENDING');
        setReservations(pending);
      })
      .catch(err => console.error(err));
  }, []);

  const fetchOrderDetails = (orderId) => {
    axios.get(`http://localhost:8080/api/orders/${orderId}/details`)
      .then(res => setOrderDetails(res.data));
  };

  const fetchOrderOfTable = (tableId) => {
    axios.get(`http://localhost:8080/api/orders/table/${tableId}`)
      .then(res => {
        if (res.data) {
          setCurrentOrder(res.data);
          fetchOrderDetails(res.data.id);
          setVoucherCode(res.data.voucherCode || "");
        } else {
          setCurrentOrder(null);
          setOrderDetails([]);
          setVoucherCode("");
        }
      });
  };

  // --- 3. USE EFFECT ---
  useEffect(() => {
    if (currentUser) {
        fetchProducts();
        fetchCategories();
        fetchVouchers(); 
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return; 
    fetchTables();
    fetchReservations();
    const interval = setInterval(() => {
      if (view === 'TABLE_MAP') {
        fetchTables(); 
        fetchReservations();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [view, currentUser, fetchTables, fetchReservations]);

  // --- 4. LOGIC & HANDLERS ---
  const getDuration = (startTime) => {
    if (!startTime) return 0;
    const start = new Date(startTime);
    const now = new Date();
    const diffMs = now - start;
    return Math.floor(diffMs / 60000); 
  };

  const filteredTables = tables.filter(table => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'EMPTY') return table.status === 'Trống';
    if (filterStatus === 'BUSY') return table.status === 'Có khách';
    if (filterStatus === 'RESERVED') return table.status === 'Đã đặt';
    return true;
  });

  const stats = {
    total: tables.length,
    empty: tables.filter(t => t.status === 'Trống').length,
    busy: tables.filter(t => t.status === 'Có khách').length,
    reserved: tables.filter(t => t.status === 'Đã đặt').length,
  };

  const handleSearchCustomer = () => {
    if (!phoneSearch) return;
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneSearch)) return alert("Vui lòng nhập đúng 10 số điện thoại!");
    
    axios.get(`http://localhost:8080/api/customers/search?phone=${phoneSearch}`)
      .then(res => {
        if (res.data) {
          setCustomer(res.data);
          setPointsToUse(0); 
          alert(`Đã chọn: ${res.data.name} (Điểm: ${res.data.points})`);
        } else {
          if(window.confirm("Khách hàng chưa tồn tại. Tạo mới ngay?")) {
            const name = prompt("Nhập tên khách hàng:");
            if(name) {
              axios.post('http://localhost:8080/api/customers', { name, phone: phoneSearch, points: 0 })
                .then(res => setCustomer(res.data));
            }
          }
        }
      }).catch(err => console.error(err));
  };

  const handleLoginSuccess = (employee) => {
    localStorage.setItem('pos_user', JSON.stringify(employee));
    setCurrentUser(employee);
  };

  const handleLogout = () => {
    if(window.confirm("Bạn muốn kết thúc ca làm việc?")) {
      localStorage.removeItem('pos_user');
      setCurrentUser(null);
    }
  };

  const handleTableClick = (table) => {
    setSelectedTable(table);
    if (table.status === 'Trống') {
      setShowTableModal(true);
    } else if (table.status === 'Đã đặt') {
      if(window.confirm(`Mở bàn cho khách đặt trước?\n(${table.guestInfo})`)) {
        setView('ORDER_MENU');
        fetchOrderOfTable(table.id);
      }
    } else {
      setView('ORDER_MENU');
      fetchOrderOfTable(table.id);
    }
  };

  const handleAssignReservation = () => {
    if (!selectedReservationId) return alert("Vui lòng chọn khách đặt!");
    axios.post(`http://localhost:8080/api/tables/assign-reservation`, null, {
      params: { tableId: selectedTable.id, reservationId: selectedReservationId }
    }).then(() => {
      alert("Đã xếp bàn thành công!");
      setShowTableModal(false);
      setSelectedReservationId("");
      fetchTables();
      fetchReservations();
    });
  };

  const handleOpenNormalTable = () => {
    setShowTableModal(false);
    setView('ORDER_MENU');
    fetchOrderOfTable(selectedTable.id);
  };

  const handleFreeTable = (e, tableId) => {
    e.stopPropagation();
    if(window.confirm("Hủy đặt bàn này và trả về trạng thái Trống?")) {
      axios.post(`http://localhost:8080/api/tables/${tableId}/free`).then(() => fetchTables());
    }
  };

  const handleBackToMap = () => {
    setSelectedTable(null);
    setCurrentOrder(null);
    setOrderDetails([]);
    setKitchenNote("");
    setCustomer(null); 
    setPhoneSearch(""); 
    setProductSearch(""); 
    setActiveCategory("ALL"); 
    setPointsToUse(0); 
    setVoucherCode(""); 
    setView('TABLE_MAP');
    fetchTables();
  };

  const addToOrder = (product) => {
    const note = kitchenNote ? kitchenNote : ""; 
    axios.post(`http://localhost:8080/api/orders/add`, null, {
      params: { tableId: selectedTable.id, productId: product.id, quantity: 1, note: note }
    }).then(res => {
      setCurrentOrder(res.data);
      fetchOrderDetails(res.data.id);
      setKitchenNote("");
    }).catch(err => { console.error(err); alert("Lỗi gọi món!"); });
  };

  const handleRemoveItem = (detailId) => {
    if(window.confirm("Xóa món này khỏi đơn?")) {
      axios.delete(`http://localhost:8080/api/orders/details/${detailId}`)
        .then(res => {
          setCurrentOrder(res.data);
          fetchOrderDetails(res.data.id);
        })
        .catch(err => { console.error(err); alert("Lỗi khi xóa món!"); });
    }
  };

  const handleApplyVoucher = async () => {
    if (!currentOrder) return;
    try {
        const res = await axios.post(`http://localhost:8080/api/orders/${currentOrder.id}/apply-voucher?code=${voucherCode}`);
        setCurrentOrder(res.data); 
        alert(`Đã áp dụng mã ${voucherCode} thành công!`);
    } catch (error) {
        alert(error.response?.data?.message || "Mã không hợp lệ");
    }
  };

  const handleConfirmPayment = () => {
    const url = `http://localhost:8080/api/orders/${currentOrder.id}/pay?customerId=${customer ? customer.id : ''}&pointsUsed=${pointsToUse}`;
    axios.post(url)
      .then(() => { 
        alert("Thanh toán thành công! Bàn đã trống."); 
        handleBackToMap();  
      })
      .catch(err => console.error(err));
  };

  if (!currentUser) return <PosLogin onLoginSuccess={handleLoginSuccess} />;

  // --- RENDER GIAO DIỆN ---
  if (view === 'TABLE_MAP') {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Header Sơ đồ bàn */}
        <header className="bg-white shadow-sm px-6 py-4 z-10">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
                🍽️ POS SYSTEM <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded">Ca: {currentUser.shift}</span>
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-bold text-gray-800">{currentUser.name}</p>
                <p className="text-xs text-gray-500">{currentUser.employeeCode}</p>
              </div>
              <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-100 text-sm transition">
                Đăng xuất
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-bold border border-blue-100">
                <span>Tổng:</span> <span className="text-xl">{stats.total}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg font-bold border border-green-100">
                <span>Trống:</span> <span className="text-xl">{stats.empty}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg font-bold border border-red-100">
                <span>Có khách:</span> <span className="text-xl">{stats.busy}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg font-bold border border-yellow-100">
                <span>Đã đặt:</span> <span className="text-xl">{stats.reserved}</span>
              </div>
            </div>

            <div className="flex bg-gray-200 p-1 rounded-lg">
              {['ALL', 'EMPTY', 'BUSY', 'RESERVED'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${
                    filterStatus === status ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {status === 'ALL' ? 'Tất cả' : status === 'EMPTY' ? 'Trống' : status === 'BUSY' ? 'Có khách' : 'Đã đặt'}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Grid Bàn */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredTables.map(table => {
              const orderInfo = activeOrdersMap[table.id];
              const duration = orderInfo ? getDuration(orderInfo.startTime) : 0;

              return (
                <div 
                  key={table.id}
                  onClick={() => handleTableClick(table)}
                  className={`relative h-40 rounded-2xl shadow-sm border-2 flex flex-col justify-between p-4 cursor-pointer transition-all hover:scale-105 hover:shadow-md group
                    ${table.status === 'Trống' ? 'bg-white border-green-400' : 
                      table.status === 'Đã đặt' ? 'bg-yellow-50 border-yellow-400' :
                      'bg-white border-red-500 ring-2 ring-red-100'}`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-extrabold text-gray-700">{table.name}</h3>
                    {table.status === 'Có khách' && (
                      <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                        {duration} phút
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-center flex-1 flex-col">
                    {table.status === 'Trống' && <span className="text-4xl opacity-30">🪑</span>}
                    
                    {table.status === 'Đã đặt' && (
                      <>
                        <span className="text-3xl mb-1">📅</span>
                        {table.guestInfo && (
                          <p className="text-xs text-yellow-700 font-bold text-center bg-yellow-100 px-2 py-1 rounded mt-1 w-full truncate">
                            {table.guestInfo}
                          </p>
                        )}
                      </>
                    )}

                    {table.status === 'Có khách' && (
                      <div className="text-center">
                        <span className="text-3xl">🍜</span>
                        {orderInfo && (
                          <p className="text-red-600 font-bold mt-1 text-lg">
                            {orderInfo.total.toLocaleString()} <span className="text-xs">đ</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-end">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md 
                      ${table.status === 'Trống' ? 'bg-green-100 text-green-700' : 
                        table.status === 'Đã đặt' ? 'bg-yellow-100 text-yellow-700' : 
                        'bg-red-100 text-red-700'}`}>
                      {table.status}
                    </span>
                    
                    {table.status === 'Đã đặt' && (
                      <button 
                        onClick={(e) => handleFreeTable(e, table.id)}
                        className="text-gray-400 hover:text-red-600 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition"
                        title="Hủy đặt"
                      >
                        ✖
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Đặt bàn */}
        <div className="bg-white border-t border-gray-200 p-4 h-48 overflow-y-auto">
          <h2 className="text-sm font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
            📅 Khách đặt bàn Online <span className="bg-blue-100 text-blue-600 px-2 rounded-full text-xs">{reservations.length}</span>
          </h2>
          
          {reservations.length === 0 ? (
            <p className="text-gray-400 italic text-sm">Chưa có khách đặt trước.</p>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {reservations.map(res => (
                <div key={res.id} className="min-w-[250px] border border-blue-100 bg-blue-50 p-3 rounded-xl flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between">
                      <p className="font-bold text-gray-800">{res.customerName}</p>
                      <span className="text-xs bg-white px-2 py-0.5 rounded text-blue-600 font-bold shadow-sm">
                        {new Date(res.reservationTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">📞 {res.phone}</p>
                    <p className="text-xs text-gray-600">👥 {res.guestCount} khách</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Mở bàn */}
        {showTableModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 animate-bounce-in">
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Mở {selectedTable?.name}
              </h3>
              
              <div className="space-y-4">
                <button onClick={handleOpenNormalTable} className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg transform hover:-translate-y-1 transition">
                  🚀 Khách vãng lai (Vào ngay)
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase font-bold">Hoặc xếp bàn</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <div>
                  <select 
                    className="w-full p-3 border border-gray-300 rounded-xl mb-3 bg-gray-50 focus:ring-2 focus:ring-blue-200 outline-none"
                    value={selectedReservationId}
                    onChange={(e) => setSelectedReservationId(e.target.value)}
                  >
                    <option value="">-- Chọn khách đặt trước --</option>
                    {reservations.map(res => (
                      <option key={res.id} value={res.id}>
                        {res.customerName} ({res.guestCount} khách) - {new Date(res.reservationTime).toLocaleTimeString()}
                      </option>
                    ))}
                  </select>
                  <button 
                    onClick={handleAssignReservation}
                    disabled={!selectedReservationId}
                    className={`w-full py-3 rounded-xl font-bold shadow-lg transition ${
                      selectedReservationId 
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white transform hover:-translate-y-1' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    📅 Xác nhận đặt bàn
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setShowTableModal(false)}
                className="mt-6 w-full text-gray-400 hover:text-gray-800 text-sm font-bold"
              >
                Đóng lại
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- GIAO DIỆN 2: GỌI MÓN (ĐÃ TÁCH COMPONENT) ---
  return (
    <PosOrderInterface 
        table={selectedTable}
        currentUser={currentUser}
        products={products}
        categories={categories}
        currentOrder={currentOrder}
        orderDetails={orderDetails}
        
        activeCategory={activeCategory} setActiveCategory={setActiveCategory}
        productSearch={productSearch} setProductSearch={setProductSearch}
        kitchenNote={kitchenNote} setKitchenNote={setKitchenNote}
        customer={customer} setCustomer={setCustomer}
        phoneSearch={phoneSearch} setPhoneSearch={setPhoneSearch}
        pointsToUse={pointsToUse} setPointsToUse={setPointsToUse}
        availableVouchers={availableVouchers}
        voucherCode={voucherCode} setVoucherCode={setVoucherCode}

        onBackToMap={handleBackToMap}
        onAddToOrder={addToOrder}
        onRemoveItem={handleRemoveItem}
        onSearchCustomer={handleSearchCustomer}
        onApplyVoucher={handleApplyVoucher}
        onConfirmPayment={handleConfirmPayment}
    />
  );
};

export default PosPage;