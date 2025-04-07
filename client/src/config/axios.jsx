import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_KEY,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.method?.toLowerCase() === "options") {
      config.headers["Access-Control-Request-Method"] = "GET, POST, PUT, PATCH, DELETE";
      config.headers["Access-Control-Request-Headers"] = "Authorization, Content-Type";
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === "Network Error") {
      console.error("CORS Error or Network Issue - Kiểm tra cấu hình CORS hoặc kết nối mạng");
    } else if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        console.error("Authentication Error - Token không hợp lệ hoặc đã hết hạn");
        // localStorage.removeItem("token");
        // window.location.href = "/login";
      } else if (status === 403) {
        console.error("Authorization Error - Không đủ quyền truy cập");
      }
    }
    return Promise.reject(error);
  }
);

export const checkApiConnection = async () => {
  try {
    await axiosInstance.options("/");
    console.log("API connection successful");
    return true;
  } catch (error) {
    console.error("API connection failed:", error);
    return false;
  }
};

export default axiosInstance;