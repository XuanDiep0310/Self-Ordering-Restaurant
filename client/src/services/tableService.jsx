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
export const updateTableStatus = async (tableNumber, status) => {
  try {
    const response = await axiosInstance.put(`/api/tables/${tableNumber}`, { status });
    return response.data; // Trả về dữ liệu sau khi cập nhật
  } catch (error) {
    console.error(`Error updating table ${tableNumber} status:`, error);
    throw error;
  }
};

// Hàm thêm bàn mới
export const addTable = async (tableData) => {
  try {
    const response = await axiosInstance.post("/api/tables", tableData);
    return response.data; // Trả về dữ liệu sau khi thêm bàn
  } catch (error) {
    console.error("Error adding new table:", error);
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