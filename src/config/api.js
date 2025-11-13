// src/config/api.js
import axios from "axios";

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// REQUEST INTERCEPTOR - Add auth token to every request
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("access_token");

    // If token exists, add it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR - Handle token refresh on 401 errors
api.interceptors.response.use(
  // On successful response, just return the response
  (response) => response,

  // On error response, check if we need to refresh token
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized) and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Mark that we've tried to refresh for this request
      originalRequest._retry = true;

      try {
        // Get refresh token from localStorage
        const refreshToken = localStorage.getItem("refresh_token");

        // If no refresh token, can't refresh - logout
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Make refresh token request (don't use 'api' instance to avoid infinite loop)
        const response = await axios.post(
          `${API_URL}/accounts/token/refresh/`,
          {
            refresh: refreshToken,
          }
        );

        // Get new access token
        const { access } = response.data;

        // Save new access token
        localStorage.setItem("access_token", access);

        // Update the Authorization header with new token
        originalRequest.headers.Authorization = `Bearer ${access}`;

        // Retry the original request with new token
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token is invalid or expired - logout user
        console.error("Token refresh failed:", refreshError);

        // Clear all auth data
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");

        // Redirect to login
        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    // For all other errors, just reject
    return Promise.reject(error);
  }
);

export default api;
