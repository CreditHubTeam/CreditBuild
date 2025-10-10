import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "", // Base URL for the API
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Log errors globally
apiClient.interceptors.response.use(
  (res) => res.data,
  (err) => {
    console.error("API Error:", err.response?.data || err.message);
    throw err.response?.data || err;
  }
);
