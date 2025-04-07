import axiosInstance from "../config/axios";

export const login = async (username, password) => {
  try {
    const response = await axiosInstance.post("/api/auth/login", { username, password });
    const { token, role } = response.data;

    // Lưu thông tin vào localStorage
    localStorage.setItem("username", username);
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    return { success: true, role };
  } catch (error) {
    console.error("Error during login:", error);
    return { success: false, message: "Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin." };
  }
};

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