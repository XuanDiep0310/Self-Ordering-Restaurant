import axiosInstance from "../config/axios";

export const getAllEmployees = async () => {
  const response = await axiosInstance.get("/api/admin/staff");
  return response.data;
};

export const updateEmployee = async (id, data) => {
  try {
    const response = await fetch(`/api/admin/staff/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update employee");
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating employee:", error);
    throw error;
  }
};

export const deleteEmployeeById = async (id) => {
  const response = await axiosInstance.delete(`/api/admin/staff/${id}`);
  return response.data;
};

export const addNewEmployee = async (employee) => {
  try {
    const response = await axiosInstance.post("/api/admin/staff/register");
    return response.data;
  } catch (error) {
    console.error("Error adding new employee:", error);
    throw new Error("Failed to add employee");
  }
};