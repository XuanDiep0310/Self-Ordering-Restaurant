import axiosInstance from "../config/axios";

export const getAllEmployees = async () => {
  const response = await axiosInstance.get("/api/admin/staff");
  return response.data;
};

export const updateEmployee = async (staffId, updatedData) => {
  try {
    const response = await axiosInstance.put(`/api/admin/staff/${staffId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

export const deleteEmployeeById = async (id) => {
  const response = await axiosInstance.delete(`/api/admin/staff/${id}`);
  return response.data;
};

export const addNewEmployee = async (employee) => {
  try {
    const response = await axiosInstance.post("/api/admin/staff/register", employee);
    return response.data;
  } catch (error) {
    console.error("Error adding new employee:", error);
    throw new Error("Failed to add employee");
  }
};