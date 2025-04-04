import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Customer/HomePage";
import MenuPage from "./pages/Customer/MenuPage";
import FoodDetailPage from "./pages/Customer/FoodDetailPage"; // Import trang chi tiết món ăn
import CartPage from "./pages/Customer/CartPage"; // Import trang giỏ hàng
import LoginPage from "./pages/LoginPage";
import StaffDashboard from "./pages/StaffDashboard";
import OrderPage from "./pages/Customer/OrderPage";
import InvoicePage from "./pages/Customer/InvoicePage"; // Import trang hóa đơn
import ReviewPage from "./pages/Customer/ReviewPage"; // Import trang đánh giá
import AdminDashboard from "./pages/AdminDashboard"; // Import trang dashboard admin
import EditMenu from "./components/EditMenu"; // Import trang chỉnh sửa menu
import ManagementTable from "./components/Management_table"; // Import trang quản lý bàn
import Employees from "./components/Employees"; // Import trang quản lý nhân viên

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang đăng nhập */}
        <Route path="/login" element={<LoginPage />} />
        {/* Trang chủ */}
        <Route path="/" element={<HomePage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/invoice" element={<InvoicePage />} /> {/* Thêm route Hóa đơn */}
        <Route path="/review" element={<ReviewPage />} /> {/* Thêm route Đánh giá */}
        {/* Trang menu */}
        <Route path="/menu" element={<MenuPage />} />
        {/* Trang chi tiết món ăn */}
        <Route path="/food/:foodId" element={<FoodDetailPage />} />
        {/* Trang giỏ hàng */}
        <Route path="/cart" element={<CartPage />} />
        {/* Trang dashboard nhân viên */}
        <Route path="/dashboard" element={<StaffDashboard />} />
        {/* Trang dashboard admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        {/* Trang chỉnh sửa menu */}
        <Route path="/admin/menu" element={<EditMenu />} />
        {/* Trang quản lý bàn */}
        <Route path="/admin/tables" element={<ManagementTable />} />
        {/* Trang quản lý nhân viên */}
        <Route path="/admin/employees" element={<Employees />} />
      </Routes>
    </Router>
  );
}

export default App;