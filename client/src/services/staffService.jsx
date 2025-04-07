import axiosInstance from "../config/axios";

export const getStaffInfo = async () => {
  try {
    const username = localStorage.getItem("username");
    if (!username) throw new Error("Username not found in localStorage");

    const response = await axiosInstance.get(`/api/staff/profile/${username}`);
    return response.data;
  } catch (error) {
    logError("fetching staff info", error);
    throw error;
  }
};

export const updateStaffInfo = async (updatedData) => {
  try {
    const username = localStorage.getItem("username");
    if (!username) throw new Error("Username not found in localStorage");

    const response = await axiosInstance.patch(
      `/api/staff/profile/${username}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    logError("updating staff info", error);
    throw error;
  }
};

// Helper function to log errors consistently
function logError(action, error) {
  console.error(`Error ${action}:`, error);

  if (error.response) {
    const { status, data } = error.response;
    console.error(`Server responded with status ${status}:`, data);

    // Optional: Add specific error handling based on status codes if needed
  } else if (error.request) {
    console.error("No response received from server:", error.request);
  }
}