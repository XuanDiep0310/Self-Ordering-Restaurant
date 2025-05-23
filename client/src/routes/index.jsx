// routes/index.jsx
import HomePage from "../pages/Customer/HomePage";
import MenuPage from "../pages/Customer/MenuPage";
import FoodDetailPage from "../pages/Customer/FoodDetailPage";
import CartPage from "../pages/Customer/CartPage";
import LoginPage from "../pages/LoginPage";
import StaffDashboard from "../pages/StaffDashBoard/index.jsx";
import OrderPage from "../pages/Customer/OrderPage";
import InvoicePage from "../pages/Customer/InvoicePage";
import ReviewPage from "../pages/Customer/ReviewPage";
import AdminDashboard from "../pages/Admin";
import EditMenu from "../pages/Admin/EditMenu";
import ManagementTable from "../pages/Admin/ManagementTable";
import Employees from "../pages/Admin/Employees";
import Account from "../pages/Admin/ManagementAccount";
import ProtectedRoute from "../components/ProtectedRoute";
import ForbiddenPage from "../pages/Forbidden";
import Feedback from "../pages/Admin/Feedback";
import Inventory from "../pages/Admin/Inventory";
import AdminInfo from "../pages/Admin/AdminInfo";
import Revenue from "../pages/Admin/Revenue";
import PaymentHistory from "../pages/Admin/PaymentHistory";

// Tạo helper function để làm ngắn gọn code
const adminRoute = (element) => (
  <ProtectedRoute allowedRoles={["ADMIN"]}>{element}</ProtectedRoute>
);

const staffRoute = (element) => (
  <ProtectedRoute allowedRoles={["STAFF", "ADMIN"]}>{element}</ProtectedRoute>
);

const routes = [
  // Public routes
  { path: "/customer", element: <HomePage /> },
  { path: "/menu", element: <MenuPage /> },
  { path: "/food/:dishId", element: <FoodDetailPage /> },
  { path: "/cart", element: <CartPage /> },
  { path: "/order", element: <OrderPage /> },
  { path: "/invoice", element: <InvoicePage /> },
  { path: "/review", element: <ReviewPage /> },
  { path: "/forbidden", element: <ForbiddenPage /> },
  { path: "/login", element: <LoginPage /> },

  // Staff routes (cho phép cả STAFF và ADMIN truy cập)
  { path: "/staff", element: staffRoute(<StaffDashboard />) },

  // Admin routes (chỉ ADMIN)
  { path: "/admin", element: adminRoute(<AdminDashboard />) },
  { path: "/admin/menu", element: adminRoute(<EditMenu />) },
  { path: "/admin/tables", element: adminRoute(<ManagementTable />) },
  { path: "/admin/employees", element: adminRoute(<Employees />) },
  { path: "/admin/account", element: adminRoute(<AdminInfo />) },
  { path: "/admin/feedback", element: adminRoute(<Feedback />) },
  { path: "/admin/inventory", element: adminRoute(<Inventory />) },
  { path: "/admin/revenue", element: adminRoute(<Revenue />) },
  { path: "/admin/payment-history", element: adminRoute(<PaymentHistory />) },
];

export default routes;
