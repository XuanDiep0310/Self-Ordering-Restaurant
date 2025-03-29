import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import OrderList from "../components/OrderList";
import StatusCard from "../components/StatusCard";
import FoodList from "../components/FoodList"; // Thêm component mới
import "../assets/styles/custom.css";
import { getTableData } from "../services/tableService";
import NotificationList from "../components/NotificationList";

const StaffDashboard = () => {
  const [tables, setTables] = useState([]);
  const [activeTab, setActiveTab] = useState("ĐƠN HÀNG"); // Quản lý tab hiện tại
  const [activeStatus, setActiveStatus] = useState("BÀN ĐANG PHỤC VỤ");

  useEffect(() => {
    getTableData().then((data) => setTables(data));
  }, []);

  const statusList = [
    { title: "BÀN ĐANG ORDER", count: 3 },
    { title: "BÀN ĐANG PHỤC VỤ", count: 2 },
    { title: "YÊU CẦU THANH TOÁN", count: 3 },
    { title: "BÀN ĐANG TRỐNG", count: 3 },
  ];

  return (
    <div className="min-h-screen background-image">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="p-12">
        {activeTab === "ĐƠN HÀNG" && (
          <div className="grid grid-cols-3 gap-12">
            <div className="col-span-2">
              <OrderList tables={tables} />
            </div>
            <div className="space-y-8">
              {statusList.map((status) => (
                <StatusCard
                  key={status.title}
                  title={status.title}
                  count={status.count}
                  active={activeStatus === status.title}
                  onClick={() => setActiveStatus(status.title)}
                />
              ))}
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