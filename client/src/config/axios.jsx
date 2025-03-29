import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_KEY, // Thay đổi URL này theo API của bạn
  timeout: 10000, // Thời gian chờ tối đa (10 giây)
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để xử lý request
axiosInstance.interceptors.request.use(
  (config) => {
    // Thêm token vào header nếu cần
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý lỗi chung, ví dụ: thông báo lỗi hoặc chuyển hướng
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;