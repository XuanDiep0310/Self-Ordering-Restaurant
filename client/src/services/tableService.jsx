import axiosInstance from "../config/axios";

// Hàm lấy danh sách bàn
export const getTableData = async () => {
  try {
    const response = await axiosInstance.get("/tables");
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.error("Error fetching table data:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Hàm cập nhật trạng thái bàn
export const updateTableStatus = async (tableId, status) => {
  try {
    const response = await axiosInstance.put(`/tables/${tableId}`, { status });
    return response.data; // Trả về dữ liệu sau khi cập nhật
  } catch (error) {
    console.error(`Error updating table ${tableId} status:`, error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Hàm thêm bàn mới
export const addTable = async (tableData) => {
  try {
    const response = await axiosInstance.post("/tables", tableData);
    return response.data; // Trả về dữ liệu sau khi thêm bàn
  } catch (error) {
    console.error("Error adding new table:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Hàm xóa bàn
export const deleteTable = async (tableId) => {
  try {
    const response = await axiosInstance.delete(`/tables/${tableId}`);
    return response.data; // Trả về dữ liệu sau khi xóa bàn
  } catch (error) {
    console.error(`Error deleting table ${tableId}:`, error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};