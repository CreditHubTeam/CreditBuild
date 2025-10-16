import axios from "axios";
import { ApiResponse } from "../types";

// Custom error class to preserve server error details
export class ApiError extends Error {
  public code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
  }
}

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
    // Preserve the exact error message from server
    throw new ApiError(response.error.message, response.error.code);
  }
};

// Log errors globally
// apiClient.interceptors.response.use(
//   (res) => res.data,
//   (err) => {
//     console.error("API Error:", err.response?.data || err.message);
//     throw err.response?.data || err;
//   }
// );

// Enhanced interceptor - handle API errors (400, 422) but reject real network errors
apiClient.interceptors.response.use(
  (res) => res.data, // Success: just return the data part
  (err) => {
    // If it's an API error response (400, 422) with structured error data
    if (
      err.response?.status >= 400 &&
      err.response?.status < 500 &&
      err.response?.data
    ) {
      // Return the error response data so handleApiResponse can process it
      return err.response.data;
    }

    // For real network errors (500, timeout, no connection), reject
    console.error(
      "Network/HTTP Error:",
      err.response?.status || "Network",
      err.message
    );
    return Promise.reject(err);
  }
);
