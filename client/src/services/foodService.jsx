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

// Hàm lấy danh sách món cần làm
export const getPendingFoodItems = async () => {
  try {
    const response = await axiosInstance.get("/order_items");
    const orderItems = response.data;

    // Lọc các món có trạng thái "Ordered" và tính tổng số lượng
    const pendingItems = orderItems
      .filter((item) => item.status === "Ordered")
      .reduce((acc, item) => {
        const existingItem = acc.find((i) => i.dish_id === item.dish_id);
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          acc.push({ dish_id: item.dish_id, quantity: item.quantity });
        }
        return acc;
      }, []);

    // Lấy thông tin chi tiết món ăn từ bảng "dishes"
    const dishesResponse = await axiosInstance.get("/dishes");
    const dishes = dishesResponse.data;

    // Kết hợp thông tin món ăn với số lượng
    return pendingItems.map((item) => {
      const dish = dishes.find((d) => d.id === item.dish_id);
      return {
        id: item.dish_id,
        name: dish.name,
        quantity: item.quantity,
      };
    });
  } catch (error) {
    console.error("Error fetching pending food items:", error);
    throw error;
  }
};

// Hàm lấy danh sách món ăn theo danh mục
export const getFoodItemsByCategory = async (categoryId) => {
  try {
    const response = await axiosInstance.get(`/dishes?category_id=${categoryId}`);
    return response.data; // Trả về danh sách món ăn
  } catch (error) {
    console.error("Error fetching food items by category:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Hàm lấy thông tin món ăn theo ID
export const getFoodById = async (foodId) => {
  try {
    const response = await axiosInstance.get(`/dishes/${foodId}`);
    return response.data; // Trả về thông tin chi tiết món ăn
  } catch (error) {
    console.error(`Error fetching food item with ID ${foodId}:`, error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};