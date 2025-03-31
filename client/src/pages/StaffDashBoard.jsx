import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import OrderList from "../components/OrderList"; // Hiển thị danh sách bàn đang phục vụ
import EmptyTableList from "../components/EmptyTableList"; // Hiển thị danh sách bàn trống
import FoodList from "../components/FoodList";
import NotificationList from "../components/NotificationList";
import "../assets/styles/custom.css";
import { getTableData } from "../services/tableService";

const StaffDashboard = () => {
  const [tables, setTables] = useState([]);
  const [activeTab, setActiveTab] = useState("ĐƠN HÀNG"); // Quản lý tab hiện tại

  useEffect(() => {
    getTableData().then((data) => setTables(data));
  }, []);

  return (
    <div className="min-h-screen background-image">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="p-12">
        {activeTab === "ĐƠN HÀNG" && (
          <div className="grid grid-cols-3 gap-12">
            <div className="col-span-2">
              <OrderList tables={tables.filter((table) => table.status !== "Available")} />
            </div>
            <div>
              <EmptyTableList tables={tables.filter((table) => table.status === "Available")} />
            </div>
          </div>
        )}
        {activeTab === "MÓN ĂN" && <FoodList />}
        {activeTab === "THÔNG BÁO" && <NotificationList/>}
      </div>
    </div>
  );
};

export default StaffDashboard;