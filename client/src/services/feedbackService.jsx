import axiosInstance from "../config/axios";

// Hàm gửi đánh giá

export const sendFeedback = async (feedbackData) => {
    try {
        const response = await axiosInstance.post("/api/feedback", feedbackData);
        return response.data; // Trả về dữ liệu phản hồi từ API
    } catch (error) {
        console.error("Error sending feedback:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};
// Hàm lấy danh sách đánh giá
export const getReviews = async () => {
    try {
        const response = await axiosInstance.get("/api/feedback");
        return response.data; // Trả về danh sách đánh giá
    } catch (error) {
        console.error("Error fetching reviews:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};