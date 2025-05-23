import axiosInstance from "../config/axios";

export const getPaymentHistory = async () => {
  const response = await axiosInstance.get("/api/payment/history");
  return response.data;
};

export const downloadHistoryBillPDF = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/api/payment/bill/history/${orderId}/pdf`, {
      responseType: 'blob'  // Quan trọng: để nhận file binary
    });

    // Tạo URL từ blob response
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);

    // Tạo link tạm thời để download
    const link = document.createElement('a');
    link.href = url;
    link.download = `hoa-don-so-${orderId}.pdf`;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading bill PDF:', error);
    throw error;
  }
};