import axios from "axios";
import { getToken } from "./auth.js";

// const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = "https://gtw-backend-qhwv.onrender.com/api";

//api
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Don't redirect if it's a login request or we're already on the login page
    const isLoginRequest =
      originalRequest.url?.includes("/auth/admin-login") ||
      originalRequest.url?.includes("/auth/login");
    const isOnLoginPage = window.location.pathname === "/login";

    if (error.response?.status === 401 && !isLoginRequest && !isOnLoginPage) {
      // Token expired, redirect to login
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
