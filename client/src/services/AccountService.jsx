import axiosInstance from "../config/axios";

export const getAllAccounts = async () => {
  const response = await axiosInstance.get("/api/admin/users");
  return response.data;
};

export const updateAccount = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/api/admin/users/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật tài khoản:", error);
    throw error;
  }
};

export const deleteAccountById = async (id) => {
  const response = await axiosInstance.delete(`/api/admin/users/${id}`);
  return response.data;
};

export const addNewAccount = async (account) => {
  try {
    const response = await axiosInstance.post("/api/admin/users", account);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm tài khoản mới:", error);
    throw new Error("Không thể thêm tài khoản");
  }
};