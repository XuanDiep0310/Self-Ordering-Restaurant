import axiosInstance from "../config/axios";

export const getAllEmployees = async () => {
  const response = await axiosInstance.get("/api/admin/staff");
  return response.data;
};

export const updateEmployee = async (id, data) => {
  const response = await axiosInstance.put(`/api/admin/staff/${id}`, data);
  return response.data;
};

export const deleteEmployeeById = async (id) => {
  const response = await axiosInstance.delete(`/api/admin/staff/${id}`);
  return response.data;
};

export const addNewEmployee = async (data) => {
  try {
    const response = await axiosInstance.post("/api/admin/staff/register", data);
    return response.data;
  } catch (error) {
    console.error("Error adding new employee:", error);
    throw error;
  }
};
