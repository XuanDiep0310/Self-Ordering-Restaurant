import axiosInstance from "../config/axios";

export const getInventoryItems = async () => {
  try {
    const response = await axiosInstance.get("/api/inventory");
    return response.data.map((item) => ({
      ...item,
      lastUpdated: new Date(item.lastUpdated).toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    throw error;
  }
};

export const addInventoryItem = async (itemData) => {
  try {
    const response = await axiosInstance.post("/api/inventory", itemData);
    return {
      ...response.data,
      lastUpdated: new Date(response.data.lastUpdated).toISOString(),
    };
  } catch (error) {
    console.error("Error adding inventory item:", error);
    throw error;
  }
};