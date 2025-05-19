import axiosInstance from "../config/axios";
import axios from "axios";

const API_URL = "/api/inventory";

export const getInventoryItems = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
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
    const response = await axiosInstance.post("/api/inventory", itemData); // Gửi payload đến API
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Error adding inventory item");
    }
    throw error;
  }
};

export const searchInventoryItems = async (name) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/search?name=${name}`);
    return response.data.map((item) => ({
      ...item,
      lastUpdated: new Date(item.lastUpdated).toISOString(),
    }));
  } catch (error) {
    console.error("Error searching inventory items:", error);
    throw error;
  }
};

export const getIngredients = async () => {
  try {
    const response = await axiosInstance.get("/api/ingredients"); // Sử dụng axiosInstance
    return response.data;
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    throw error;
  }
};

export const addIngredient = async (ingredient) => {
  try {
    const response = await axiosInstance.post("/api/ingredients", ingredient);
    return response.data;
  } catch (error) {
    console.error("Error adding ingredient:", error);
    throw error;
  }
};

export const getSuppliers = async () => {
  try {
    const response = await axiosInstance.get("/api/suppliers");
    return response.data;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    throw error;
  }
};

export const addSupplier = async (supplier) => {
  try {
    const response = await axiosInstance.post("/api/suppliers", supplier);
    return response.data;
  } catch (error) {
    console.error("Error adding supplier:", error);
    throw error;
  }
};