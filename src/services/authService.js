// src/services/authService.js
import api from "../config/api";

const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post("/api/accounts/register/", userData);
    console.log(response.data);
    return response.data;
  },

  // Activate account
  activateAccount: async (uidb64, token) => {
    const response = await api.get(
      `/api/accounts/activate/${uidb64}/${token}/`
    );
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post("/api/accounts/login/", credentials);
    if (response.data.access) {
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout
  logout: async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    try {
      await api.post("/accounts/logout/", { refresh: refreshToken });
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
    }
  },

  // Refresh token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await api.post("/accounts/token/refresh/", {
      refresh: refreshToken,
    });
    if (response.data.access) {
      localStorage.setItem("accessToken", response.data.access);
    }
    return response.data;
  },

  // Password reset request
  requestPasswordReset: async (email) => {
    const response = await api.post("/api/accounts/password-reset/", { email });
    return response.data;
  },

  // Password reset confirm
  confirmPasswordReset: async (uidb64, token, newPassword) => {
    const response = await api.post(
      `/api/accounts/password-reset-confirm/${uidb64}/${token}/`,
      {
        new_password: newPassword,
      }
    );
    return response.data;
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  getRefreshToken: () => {
    return localStorage.getItem("refreshToken");
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem("accessToken");
  },

  clearAuth: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },
};

export default authService;
