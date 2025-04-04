import axiosInstance from "../config/axios";

// Hàm lấy thông tin nhân viên dựa trên user_id
export const getStaffInfo = async (userId) => {
  try {
    const response = await axiosInstance.get(`/staff?user_id=${userId}`);
    if (response.data && response.data.length > 0) {
      return response.data[0]; // Trả về thông tin nhân viên đầu tiên
    }
    throw new Error("Staff not found");
  } catch (error) {
    console.error("Error fetching staff info:", error);
    throw error;
  }
};

// Hàm cập nhật thông tin nhân viên
export const updateStaffInfo = async (staffId, updatedData) => {
  try {
    const response = await axiosInstance.put(`/staff/${staffId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating staff info:", error);
    throw error;
  }
};