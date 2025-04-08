// routes/index.jsx
import HomePage from "../pages/Customer/HomePage";
import MenuPage from "../pages/Customer/MenuPage";
import FoodDetailPage from "../pages/Customer/FoodDetailPage";
import CartPage from "../pages/Customer/CartPage";
import LoginPage from "../pages/LoginPage";
import StaffDashboard from "../pages/StaffDashboard";
import OrderPage from "../pages/Customer/OrderPage";
import InvoicePage from "../pages/Customer/InvoicePage";
import ReviewPage from "../pages/Customer/ReviewPage";
import AdminDashboard from "../pages/Admin";
import EditMenu from "../pages/Admin/EditMenu";
import ManagementTable from "../pages/Admin/Management_table";
import Employees from "../pages/Admin/Employees";
import ProtectedRoute from "../components/ProtectedRoute";
import ForbiddenPage from "../pages/Forbidden";

// Tạo helper function để làm ngắn gọn code
const adminRoute = (element) => (
  <ProtectedRoute allowedRoles={['ADMIN']}>{element}</ProtectedRoute>
);

const staffRoute = (element) => (
  <ProtectedRoute allowedRoles={['STAFF', 'ADMIN']}>{element}</ProtectedRoute>
);

const routes = [
  // Public routes
  { path: "/table/:tableId", element: <HomePage /> },
  { path: "/menu", element: <MenuPage /> },
  { path: "/food/:foodId", element: <FoodDetailPage /> },
  { path: "/cart", element: <CartPage /> },
  { path: "/order/:tableId", element: <OrderPage /> },
  { path: "/invoice", element: <InvoicePage /> },
  { path: "/review", element: <ReviewPage /> },
  { path: "/forbidden", element: <ForbiddenPage /> },
  { path: "/login", element: <LoginPage /> },

  // Staff routes (cho phép cả STAFF và ADMIN truy cập)
  { path: "/staff", element: staffRoute(<StaffDashboard />) },

  // Admin routes (chỉ ADMIN)
  { path: "/admin", element: (<AdminDashboard />) },
  { path: "/admin/menu", element:(<EditMenu />) },
  { path: "/admin/tables", element: (<ManagementTable />) },
  { path: "/admin/employees", element: (<Employees />) },
];

export default routes;