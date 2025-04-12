import axiosInstance from "../config/axios";

// Hàm lấy danh sách món ăn
export const getFoodItems = async () => {
  try {
    const response = await axiosInstance.get("/api/dishes");
    return response.data; // Trả về danh sách món ăn từ API
  } catch (error) {
    console.error("Error fetching food items:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Hàm thêm món ăn mới
export const addFoodItem = async (foodData) => {
  try {
    const response = await axiosInstance.post("/api/dishes", foodData);
    return response.data; // Trả về dữ liệu món ăn vừa thêm
  } catch (error) {
    console.error("Error adding food item:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Hàm cập nhật món ăn
export const updateFoodItem = async (foodId, foodData) => {
  try {
    const response = await axiosInstance.put(`/api/dishes/${foodId}`, foodData);
    return response.data; // Trả về dữ liệu món ăn sau khi cập nhật
  } catch (error) {
    console.error(`Error updating food item ${foodId}:`, error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Hàm xóa món ăn
export const deleteFoodItem = async (foodId) => {
  try {
    const response = await axiosInstance.delete(`/api/dishes/${foodId}`);
    return response.data; // Trả về dữ liệu sau khi xóa món ăn
  } catch (error) {
    console.error(`Error deleting food item ${foodId}:`, error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Hàm lấy danh sách món cần làm
export const getPendingFoodItems = async () => {
  try {
    const response = await axiosInstance.get(`/api/orders/pending-items`);
    return response.data;
  } catch (error) {
    console.error(`Error get pending food item: `, error);
    throw error;
  }
};

// Hàm lấy danh sách món ăn theo danh mục
export const getFoodItemsByCategory = async (categoryId) => {
  try {
    const response = await axiosInstance.get(`/api/dishes?categoryId=${categoryId}`);
    return response.data; // Trả về danh sách món ăn
  } catch (error) {
    console.error("Error fetching food items by category:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Hàm lấy thông tin món ăn theo ID
export const getFoodById = async (dishId) => {
  try {
    const response = await axiosInstance.get(`/api/dishes/${dishId}`);
    return response.data; // Trả về thông tin chi tiết món ăn
  } catch (error) {
    console.error(`Error fetching food item with ID ${dishId}:`, error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};