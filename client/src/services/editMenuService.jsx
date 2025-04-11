import axiosInstance from "../config/axios";

// Lấy danh sách danh mục
export const getCategories = async () => {
  try {
    const response = await axiosInstance.get("/api/categories");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

// Tạo danh mục mới
export const createCategory = async (categoryData) => {
  try {
    const response = await axiosInstance.post("/api/categories", categoryData);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

// Cập nhật danh mục
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await axiosInstance.put(`/api/categories/${categoryId}`, categoryData);
    return response.data;
  } catch (error) {
    console.error(`Error updating category ${categoryId}:`, error);
    throw error;
  }
};

// Xóa danh mục
export const deleteCategory = async (categoryId) => {
  try {
    const response = await axiosInstance.delete(`/api/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting category ${categoryId}:`, error);
    throw error;
  }
};