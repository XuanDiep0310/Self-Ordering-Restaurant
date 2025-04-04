import axiosInstance from "../config/axios";

// Hàm lấy danh sách danh mục
export const getCategories = async () => {
    try {
        const response = await axiosInstance.get("/categories");
        return response.data; // Trả về danh sách danh mục
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm
    }
};