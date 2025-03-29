import axiosInstance from "../config/axios";

// Hàm lấy danh sách món ăn
export const getFoodItems = async () => {
  try {
    const response = await axiosInstance.get("/dishes");
    return response.data; // Trả về danh sách món ăn từ API
  } catch (error) {
    console.error("Error fetching food items:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Hàm thêm món ăn mới
export const addFoodItem = async (foodData) => {
  try {
    const response = await axiosInstance.post("/dishes", foodData);
    return response.data; // Trả về dữ liệu món ăn vừa thêm
  } catch (error) {
    console.error("Error adding food item:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Hàm cập nhật món ăn
export const updateFoodItem = async (foodId, foodData) => {
  try {
    const response = await axiosInstance.put(`/dishes/${foodId}`, foodData);
    return response.data; // Trả về dữ liệu món ăn sau khi cập nhật
  } catch (error) {
    console.error(`Error updating food item ${foodId}:`, error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Hàm xóa món ăn
export const deleteFoodItem = async (foodId) => {
  try {
    const response = await axiosInstance.delete(`/dishes/${foodId}`);
    return response.data; // Trả về dữ liệu sau khi xóa món ăn
  } catch (error) {
    console.error(`Error deleting food item ${foodId}:`, error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};