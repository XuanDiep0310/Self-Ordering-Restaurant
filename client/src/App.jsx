import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import EditMenu from "./pages/Admin/EditMenu";
import Management_table from "./pages/Admin/Management_table";
import Employees from "./pages/Admin/Employees";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/menu" element={<EditMenu />} />
        <Route path="/ban" element={<Management_table />} />
        <Route path="/employees" element={<Employees />} />
      </Routes>
    </Router>
  );
}

export default App;

// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HomePage from "./pages/Customer/HomePage";
// import MenuPage from "./pages/Customer/MenuPage";
// import FoodDetailPage from "./pages/Customer/FoodDetailPage"; // Import trang chi tiết món ăn
// import CartPage from "./pages/Customer/CartPage"; // Import trang giỏ hàng
// import LoginPage from "./pages/LoginPage";
// import StaffDashboard from "./pages/StaffDashboard";
// import OrderPage from "./pages/Customer/OrderPage";
// import InvoicePage from "./pages/Customer/InvoicePage"; // Import trang hóa đơn
// import ReviewPage from "./pages/Customer/ReviewPage"; // Import trang đánh giá
// import Employees from "./pages/Admin/Employees";
// import AdminDashboard from "./pages/Admin/AdminDashboard";
// // import EditMenu from "./pages/Admin/EditMenu";
// // import Management_table from "./pages/Admin/Management_table";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Trang chủ */}
//         <Route path="/" element={<AdminDashboard />} />
//         <Route path="/menumenu" element={<OrderPage />} /> 
//         <Route path="/invoice" element={<InvoicePage />} /> {/* Thêm route Hóa đơn */}
//         <Route path="/review" element={<ReviewPage />} /> {/* Thêm route Đánh giá */}
//         {/* Trang menu */}
//         <Route path="/menu" element={<MenuPage />} />
//         {/* Trang chi tiết món ăn */}
//         <Route path="/food/:foodId" element={<FoodDetailPage />} />
//         {/* Trang giỏ hàng */}
//         <Route path="/cart" element={<CartPage />} />
//         {/* Trang dashboard nhân viên */}
//         <Route path="/dashboard" element={<StaffDashboard />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;