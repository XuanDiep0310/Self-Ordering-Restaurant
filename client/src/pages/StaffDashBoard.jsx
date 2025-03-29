import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import OrderList from "../components/OrderList";
import StatusCard from "../components/StatusCard";
import "../assets/styles/custom.css";
import { getTableData } from "../services/tableService";

const StaffDashboard = () => {
  const [tables, setTables] = useState([]);
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
      <Navbar/>
      <div className="p-12 grid grid-cols-3 gap-12">
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
    </div>
  );
};

export default StaffDashboard;