import HomePage from "../pages/Customer/HomePage";
import MenuPage from "../pages/Customer/MenuPage";
import FoodDetailPage from "../pages/Customer/FoodDetailPage";
import CartPage from "../pages/Customer/CartPage";
import LoginPage from "../pages/LoginPage";
import StaffDashboard from "../pages/StaffDashboard";
import OrderPage from "../pages/Customer/OrderPage";
import InvoicePage from "../pages/Customer/InvoicePage";
import ReviewPage from "../pages/Customer/ReviewPage";
import AdminDashboard from "../pages/AdminDashBoard";
import EditMenu from "../components/EditMenu";
import ManagementTable from "../components/Management_table";
import Employees from "../components/Employees";

export const routes = [
  { path: "/login", element: <LoginPage /> },
  { path: "/table/:tableId", element: <HomePage /> },
  { path: "/order/:tableId", element: <OrderPage /> },
  { path: "/invoice", element: <InvoicePage /> },
  { path: "/review", element: <ReviewPage /> },
  { path: "/menu", element: <MenuPage /> },
  { path: "/food/:foodId", element: <FoodDetailPage /> },
  { path: "/cart", element: <CartPage /> },
  { path: "/dashboard", element: <StaffDashboard /> },
  { path: "/admin", element: <AdminDashboard /> },
  { path: "/admin/menu", element: <EditMenu /> },
  { path: "/admin/tables", element: <ManagementTable /> },
  { path: "/admin/employees", element: <Employees /> },
];
