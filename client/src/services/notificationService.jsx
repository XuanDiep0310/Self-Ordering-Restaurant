import axiosInstance from "../config/axios";

// Hàm lấy danh sách thông báo
export const getNotifications = async () => {
  try {
    const response = await axiosInstance.get("/api/notifications");
    return response.data; // Trả về danh sách thông báo từ API
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Hàm gửi thông báo mới
export const sendNotification = async (notificationData) => {
  try {
    const response = await axiosInstance.post("/api/notifications", notificationData);
    return response.data; // Trả về thông báo vừa thêm
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Hàm đánh dấu đã đọc hoặc chưa đọc thông báo
export const markAsRead = async (notificationId, isRead) => {
  try {
    const response = await axiosInstance.put(`/api/notifications/${notificationId}/read`, { isRead });
    return response.data;
  } catch (error) {
    console.error("Error marking notification:", error);
    throw error;
  }
};

// Hàm xóa thông báo
export const deleteNotification = async (notificationId) => {
  try {
    const response = await axiosInstance.delete(`/api/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

// Hàm lấy thông báo chưa đọc
export const getUnreadNotifications = async () => {
  try {
    const response = await axiosInstance.get("/api/notifications/unread");
    return response.data;
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    throw error;
  }
};

// Hàm đánh dấu tất cả đã đọc
export const markAllAsRead = async () => {
  try {
    const response = await axiosInstance.post("/api/notifications/mark-all-read");
    return response.data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

// Hàm nhận thông báo theo bàn
export const getNotificationsByTable = async (tableNumber) => {
  try {
    const response = await axiosInstance.get(`/api/notifications/table/${tableNumber}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching notifications for table ${tableNumber}:`, error);
    throw error;
  }
};