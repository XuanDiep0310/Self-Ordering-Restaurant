export const getTableData = async () => {
  try {
    const response = await fetch("http://localhost:8080/api/tables");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu bàn:", error);
    return [];
  }
};
