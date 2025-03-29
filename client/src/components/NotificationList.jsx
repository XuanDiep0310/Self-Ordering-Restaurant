import { useEffect, useState } from "react";
import { getNotifications } from "../services/notificationService";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications(); // Gọi API từ notificationService
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return <p className="text-center text-white">Đang tải dữ liệu...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl text-center text-white rounded bg-[#124035] p-4 rounded shadow-md">
        DANH SÁCH THÔNG BÁO
      </h2>
      {/* Header */}
      <div className="flex justify-between items-center bg-[#2a413c] text-white p-4 rounded shadow-md mt-4">
          <p className="w-1/6 text-center font-bold">Bàn</p>
          <p className="w-4/6 text-center font-bold">Thông báo</p>
          <p className="w-1/6 text-center font-bold">Thời gian</p>
        </div>
      <div className="bg-black/60 p-6 rounded" style={{ maxHeight: "400px", overflowY: "auto" }}>
        {/* Items */}
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-[#ced4d5] text-black p-4 rounded shadow-md">
              <p className="w-1/6 text-center font-bold">{notification.tableNumber}</p>
              <p className="w-4/6 text-center font-bold">{notification.content}</p>
              <p className="w-1/6 text-center font-bold">{notification.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationList;