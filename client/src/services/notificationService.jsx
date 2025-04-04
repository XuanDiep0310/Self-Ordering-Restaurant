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
    // Lấy danh sách thông báo
    const notificationsResponse = await axiosInstance.get("/notifications");
    const notifications = notificationsResponse.data;

    // Lấy danh sách đơn hàng
    const ordersResponse = await axiosInstance.get("/orders");
    const orders = ordersResponse.data;

    // Kết hợp dữ liệu
    return notifications.map((notification) => {
      // Tìm đơn hàng liên quan đến user_id
      const order = orders.find((order) => order.customer_id === notification.user_id);

      return {
        tableNumber: order ? order.table_number : "N/A", // Lấy table_number từ đơn hàng
        content: notification.content || "No content", // Nội dung thông báo
        createAt: notification.createAt || "Unknown time", // Thời gian gửi thông báo
      };
    });
  } catch (error) {
    console.error("Error fetching table notifications:", error);
    throw error;
  }
};