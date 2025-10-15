import axios from "axios";
import { ApiResponse } from "../types";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "", // Base URL for the API
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to handle API response
export const handleApiResponse = <T>(response: ApiResponse<T>): T => {
  if (response.ok) {
    return response.data;
  } else {
    throw new Error(`${response.error.code}: ${response.error.message}`);
  }
};

// Log errors globally
apiClient.interceptors.response.use(
  (res) => res.data,
  (err) => {
    console.error("API Error:", err.response?.data || err.message);
    throw err.response?.data || err;
  }
);
