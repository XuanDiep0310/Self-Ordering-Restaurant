import axiosInstance from "../config/axios";

// Hàm lấy danh sách bàn
export const getTableData = async () => {
  try {
    const response = await axiosInstance.get("/api/tables");
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Error fetching table data:", error);
    throw error;
  }
};
export const getTableByNumber = async (tableNumber) => {
  try {
    const response = await axiosInstance.get(`/api/tables/${tableNumber}`);
    return response.data; // Trả về dữ liệu của bàn
  } catch (error) {
    console.error(`Error fetching table ${tableNumber} data:`, error);
    throw error;
  }
};
// Hàm cập nhật trạng thái bàn
export const updateTableStatus = async (tableId, status) => {
  try {
    console.log("Sending request to update table status:", { tableId, status });
    const response = await axiosInstance.put(`/api/tables/${tableId}`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating table ${tableId} status:`, error);
    throw error;
  }
};
// Hàm thêm bàn mới
export const addTable = async (tableData) => {
  try {
    const response = await axiosInstance.post("/api/tables", {
      ...tableData,
      status: tableData.status || "Available", // Đảm bảo giá trị status được gửi đúng
    });
    return response.data;
  } catch (error) {
    console.error("Error adding new table:", error.response?.data || error.message);
    throw error;
  }
};

// Hàm xóa bàn
export const deleteTable = async (tableNumber) => {
  try {
    const response = await axiosInstance.delete(`/api/tables/${tableNumber}`);
    return response.data; // Trả về dữ liệu sau khi xóa bàn
  } catch (error) {
    console.error(`Error deleting table ${tableNumber}:`, error);
    throw error;
  }
};

export const updateTable = async (tableNumber, tableData) => {
  try {
    const response = await axiosInstance.put(`/api/tables/${tableNumber}`, tableData);
    return response.data;
  } catch (error) {
    console.error(`Error updating table ${tableNumber}:`, error);
    throw error;
  }
};