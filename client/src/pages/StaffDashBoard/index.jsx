import { useEffect, useState } from "react";
import Navbar from "../../components/Staff/Navbar";
import OrderList from "../../components/Staff/OrderList"; // Hiển thị danh sách bàn đang phục vụ
import EmptyTableList from "../../components/Staff/EmptyTableList"; // Hiển thị danh sách bàn trống
import FoodList from "../../components/Staff/FoodList";
import NotificationList from "../../components/Staff/NotificationList";
import "../../assets/styles/custom.css";
import { getTableData } from "../../services/tableService";
import { connectWebSocket, subscribeTopic, disconnectWebSocket } from "../../config/websocket";

const StaffDashboard = () => {
  const [tables, setTables] = useState([]);
  const [activeTab, setActiveTab] = useState("ĐƠN HÀNG"); // Quản lý tab hiện tại

  useEffect(() => {
    getTableData().then((data) => setTables(data));

    // WebSocket connection
    let subscription;
    const onConnect = () => {
        subscription = subscribeTopic("/topic/tables", (data) => {
            setTables(data);
        });
    };

    connectWebSocket(onConnect);

    return () => {
        if (subscription) subscription.unsubscribe();
        disconnectWebSocket();
    };
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