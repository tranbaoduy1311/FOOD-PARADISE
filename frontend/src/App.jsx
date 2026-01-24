import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import các trang Admin
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
import SupplierManager from './components/admin/SupplierManager'; 
import ContactManager from './components/admin/ContactManager';
import Login from './components/admin/Login';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Import các trang Khách hàng & POS
import PosPage from './components/PosPage';
import CustomerLayout from './components/customer/CustomerLayout';
import HomePage from './components/customer/HomePage';
import BookingPage from './components/customer/BookingPage';
import MenuPage from './components/customer/MenuPage';
import ContactPage from './components/customer/ContactPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- 1. KHU VỰC KHÁCH HÀNG (Công khai) --- */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          <Route path="booking" element={<BookingPage />} />
          <Route path="menu" element={<MenuPage />} /> 
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* --- 2. KHU VỰC NHÂN VIÊN (POS) --- */}
        <Route path="/pos" element={<PosPage />} />

        {/* --- 3. TRANG ĐĂNG NHẬP ADMIN (Phải để riêng, không bọc bảo vệ) --- */}
        <Route path="/admin/login" element={<Login />} />

        {/* --- 4. KHU VỰC QUẢN LÝ (ADMIN) - ĐƯỢC BẢO VỆ BỞI PROTECTEDROUTE --- */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Các trang con bên trong AdminLayout */}
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
          <Route path="contacts" element={<ContactManager />} />
          <Route path="suppliers" element={<SupplierManager />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;