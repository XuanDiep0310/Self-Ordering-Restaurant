import axiosInstance from "../config/axios";



// Hàm tạo đơn hàng mới
export const createOrder = async (orderData) => {
    try {
        const response = await axiosInstance.post("/api/orders", orderData);
        return response.data; // Trả về dữ liệu đơn hàng vừa tạo
    } catch (error) {
        console.error("Error creating order:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};


// Hàm lấy danh sách đơn hàng chưa thanh toán theo tableId
export const getUnpaidOrdersByTable = async (tableId) => {
    try {
        const response = await axiosInstance.get(`/api/orders?table_number=${tableId}&payment_status=Unpaid`);
        return response.data; // Trả về danh sách đơn hàng chưa thanh toán
    } catch (error) {
        console.error(`Error fetching unpaid orders for table ${tableId}:`, error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

// Hàm xóa đơn hàng
export const deleteOrder = async (orderId) => {
    try {
        const response = await axiosInstance.delete(`/api/orders/${orderId}`);
        return response.data; // Trả về dữ liệu sau khi xóa đơn hàng
    } catch (error) {
        console.error(`Error deleting order ${orderId}:`, error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};


// Hàm cập nhật trạng thái thanh toán của đơn hàng
export const updateOrderPaymentStatus = async (orderId, paymentStatus = "Paid") => {
    try {
        const response = await axiosInstance.put(`/api/orders/${orderId}/payment`, {
            payment_status: paymentStatus,
        });
        return response.data; // Trả về dữ liệu đơn hàng đã cập nhật
    } catch (error) {
        console.error(`Error updating payment status for order ${orderId}:`, error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

// Hàm lấy danh sách món order theo số bàn
export const getOrdersByTable = async (tableNumber) => {
    try {
        const response = await axiosInstance.get(`/api/orders/table/${tableNumber}`);
        return response.data; // Trả về danh sách đơn hàng
    } catch (error) {
        console.error(`Error fetching orders for table ${tableNumber}:`, error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};