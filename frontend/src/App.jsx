import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import các trang
import PosPage from './components/PosPage';
import AdminLayout from './components/admin/AdminLayout';
import ProductManager from './components/admin/ProductManager';
import TableManager from './components/admin/TableManager';
import Dashboard from './components/admin/Dashboard';
import CategoryManager from './components/admin/CategoryManager';
import EmployeeManager from './components/admin/EmployeeManager';
import IngredientManager from './components/admin/IngredientManager';
import TimekeepingManager from './components/admin/TimekeepingManager';
import AuditLogManager from './components/admin/AuditLogManager';
import PromotionManager from './components/admin/PromotionManager';
import PayrollManager from './components/admin/PayrollManager';

// --- THÊM DÒNG NÀY (QUAN TRỌNG) ---
import SupplierManager from './components/admin/SupplierManager'; 

// Import trang Khách hàng
import CustomerLayout from './components/customer/CustomerLayout';
import HomePage from './components/customer/HomePage';
import BookingPage from './components/customer/BookingPage';
import MenuPage from './components/customer/MenuPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- 1. KHU VỰC KHÁCH HÀNG --- */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          <Route path="booking" element={<BookingPage />} />
          <Route path="menu" element={<MenuPage />} /> 
        </Route>

        {/* --- 2. KHU VỰC NHÂN VIÊN (POS) --- */}
        <Route path="/pos" element={<PosPage />} />

        {/* --- 3. KHU VỰC QUẢN LÝ (ADMIN) --- */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductManager />} />
          <Route path="tables" element={<TableManager />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="employees" element={<EmployeeManager />} />
          <Route path="inventory" element={<IngredientManager />} />
          <Route path="timekeeping" element={<TimekeepingManager />} />
          <Route path="audit-logs" element={<AuditLogManager />} />
          <Route path="promotions" element={<PromotionManager />} />
          <Route path="payroll" element={<PayrollManager />} />
          
          {/* --- ĐÃ BỎ COMMENT DÒNG NÀY --- */}
          <Route path="suppliers" element={<SupplierManager />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;