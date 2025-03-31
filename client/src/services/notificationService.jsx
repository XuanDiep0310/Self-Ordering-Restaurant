import axiosInstance from "../config/axios";

// Hàm lấy danh sách thông báo
export const getNotifications = async () => {
  try {
    const response = await axiosInstance.get("/notifications");
    return response.data; // Trả về danh sách thông báo từ API
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Hàm lấy danh sách các bàn đã gửi thông báo
export const getTableNotifications = async () => {
  try {
    const response = await axiosInstance.get("/notifications");
    const notifications = response.data;

    // Lọc và định dạng dữ liệu
    return notifications.map((notification) => ({
      tableNumber: notification.title.includes("Table") ? notification.title.split("#")[1] : "N/A",
      content: notification.content,
      createAt: notification.createAt,
    }));
  } catch (error) {
    console.error("Error fetching table notifications:", error);
    throw error;
  }
};