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
// Hàm lấy danh sách món ăn đang chờ xử lý theo tableId
export const getPendingItemsByTable = async (tableId) => {
    try {
        const response = await axiosInstance.get(`/api/orders/pending-items/${tableId}`);
        return response.data; // Trả về danh sách món ăn
    } catch (error) {
        console.error(`Error fetching pending items for table ${tableId}:`, error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};

export const getBillByTable = async (tableNumber) => {
    try {
        const response = await axiosInstance.get(`/api/orders/bill/${tableNumber}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching bill for table ${tableNumber}:`, error);
        throw error;
    }
};

// ... existing code ...

export const downloadBillPDF = async (tableNumber) => {
    try {
      const response = await axiosInstance.get(`/api/orders/bill/${tableNumber}/pdf`, {
        responseType: 'blob'  // Quan trọng: để nhận file binary
      });

      // Tạo URL từ blob response
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);

      // Tạo link tạm thời để download
      const link = document.createElement('a');
      link.href = url;
      link.download = `hoa-don-ban-${tableNumber}.pdf`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading bill PDF:', error);
      throw error;
    }
  };