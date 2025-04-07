import axiosInstance from "../config/axios";

// Hàm gửi đánh giá
export const sendFeedback = async (reviewData) => {
    try {
        const response = await axiosInstance.post("/reviews", reviewData);
        return response.data; // Trả về đánh giá vừa thêm
    } catch (error) {
        console.error("Error sending review:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

// Hàm lấy danh sách đánh giá
export const getReviews = async () => {
    try {
        const response = await axiosInstance.get("/reviews");
        return response.data; // Trả về danh sách đánh giá
    } catch (error) {
        console.error("Error fetching reviews:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};