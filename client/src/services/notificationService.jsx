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

// Hàm gửi thông báo
export const sendNotification = async (notificationData) => {
  try {
    const response = await axiosInstance.post("/notifications", notificationData);
    return response.data; // Trả về thông báo vừa thêm
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};