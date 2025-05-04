// src/configs/api.js
import axios from "axios";
import { CONFIGURATIONS } from "./configs";
import showToast from "../utils/toastNotifications";

const api = axios.create({
  baseURL: CONFIGURATIONS.REACT_APP_API_BASE_URL,
});

// Request Interceptor – Add token to each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor – Token expired handling (optional for now)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const data = error.response?.data;
    showToast("error", data?.message || "An error occurred");
    return Promise.reject(error);
  }
);

export default api;
