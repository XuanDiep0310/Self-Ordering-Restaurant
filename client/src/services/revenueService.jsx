import axiosInstance from "../config/axios";

export const getPaymentHistory = async () => {
  const response = await axiosInstance.get("/api/payment/history");
  return response.data;
};
