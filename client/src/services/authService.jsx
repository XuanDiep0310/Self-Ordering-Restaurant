// authService.js - Thêm function logout
import axiosInstance from "../config/axios";

export const logout = async () => {
  try {
    // Gọi API logout
    await axiosInstance.post("/api/auth/logout");

    // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    // Chuyển hướng về trang login
    window.location.href = "/login";

    return true;
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);

    // Xử lý trường hợp API lỗi nhưng vẫn cần logout ở client
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    window.location.href = "/login";

    return false;
  }
};