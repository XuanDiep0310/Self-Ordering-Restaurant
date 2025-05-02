import axiosInstance from "../config/axios";

// Hàm gọi backend để tạo thanh toán VNPay
export const createVNPayPayment = async (paymentData) => {
    try {
        // Gọi endpoint backend để tạo thanh toán VNPay
        const response = await axiosInstance.post("/api/payment/vnpay", paymentData);
        return response.data; // Trả về dữ liệu từ backend
    } catch (error) {
        console.error("Error creating VNPay payment:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};