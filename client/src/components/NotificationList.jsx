import { useEffect, useState } from "react";
import { getNotifications, markAsRead, deleteNotification } from "../services/notificationService";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      // Sắp xếp thông báo mới nhất lên đầu
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(sortedData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đánh dấu đã đọc thông báo
  const handleMarkAsRead = async (id, read) => {
    try {
      await markAsRead(id, !read);
      // Cập nhật lại danh sách thông báo sau khi thay đổi trạng thái
      setNotifications(notifications.map(notif =>
        notif.notificationId === id ? { ...notif, read: !read } : notif
      ));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Xử lý xóa thông báo
  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      // Cập nhật lại danh sách thông báo sau khi xóa
      setNotifications(notifications.filter(notif => notif.notificationId !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Format timestamp to a more readable format
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} · ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto">
      <h2 className="text-2xl text-center text-white font-bold bg-gradient-to-r from-[#0c3128] to-[#1a5c4d] p-5 rounded-t-lg shadow-lg">
        DANH SÁCH BÀN GỬI THÔNG BÁO
      </h2>

      <div
        className="bg-gradient-to-b from-black/80 to-black/60 p-5 rounded-b-lg shadow-xl"
        style={{ maxHeight: "66vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div className="grid grid-cols-12 bg-gradient-to-r from-[#124035] to-[#1a5c4d] text-white p-4 rounded-lg shadow-md mb-4">
          <div className="col-span-2 text-center font-bold">Bàn</div>
          <div className="col-span-5 text-center font-bold">Thông báo</div>
          <div className="col-span-2 text-center font-bold">Thời gian</div>
          <div className="col-span-3 text-center font-bold">Hành động</div>
        </div>

        {/* Items */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-white text-lg font-medium">
              Không có thông báo nào
            </div>
          ) : (
            notifications.map((notification, index) => {
              // Determine status color based on how recent the notification is
              const date = new Date(notification.createdAt);
              const now = new Date();
              const minutesAgo = Math.floor((now - date) / (1000 * 60));

              let statusClass = "bg-red-500"; // Default: Urgent (recent)
              if (minutesAgo > 30) {
                statusClass = "bg-yellow-500"; // Older than 30 minutes
              } else if (minutesAgo > 10) {
                statusClass = "bg-orange-500"; // Older than 10 minutes
              }

              return (
                <div
                  key={notification.notificationId || index}
                  className={`grid grid-cols-12 items-center ${notification.read ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-50 transition-colors duration-200 p-2 rounded-lg shadow-md border-l-4 ${notification.read ? 'border-gray-400' : 'border-[#124035]'}`}
                >
                  <div className="col-span-2 flex justify-center">
                    <div className="relative">
                      <div className={`h-12 w-12 ${notification.read ? 'bg-gray-400' : 'bg-gradient-to-br from-[#124035] to-[#1d705e]'} rounded-full flex items-center justify-center`}>
                        <span className="text-white font-bold text-lg">{notification.tableNumber}</span>
                      </div>
                      {!notification.read && (
                        <div className={`absolute -top-1 -right-1 h-4 w-4 ${statusClass} rounded-full border-2 border-white`}></div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-5 pl-2  text-center">
                    <p className={`font-medium ${notification.read ? 'text-gray-600' : 'text-gray-800'}`}>
                      {notification.content}
                    </p>
                  </div>

                  <div className="col-span-2 text-center">
                    <div className="text-sm text-gray-500 font-medium">
                      {formatTime(notification.createdAt)}
                    </div>
                  </div>

                  <div className="col-span-3 flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handleMarkAsRead(notification.notificationId, notification.read)}
                      className={`cursor-pointer px-3 py-1 rounded text-white text-sm ${notification.read ? 'bg-gray-400 hover:bg-gray-700' : 'bg-green-400 hover:bg-green-700'}`}
                    >
                      {notification.read ? 'Đã đọc' : 'Chưa đọc'}
                    </button>
                    <button
                      onClick={() => handleDelete(notification.notificationId)}
                      className="cursor-pointer bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationList;