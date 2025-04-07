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

export const routes = [
  { path: "/login", element: <LoginPage /> },
  { path: "/", element: <HomePage /> },
  { path: "/order", element: <OrderPage /> },
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
  { path: "/admin/inventory", },//Kho
  { path: "/admin/users", },//Tài Khoản
  { path: "/admin/feedback", },//Phản hồi
  { path: "/admin/revenue", },//Doanh thu
];
