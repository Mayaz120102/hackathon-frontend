// src/services/profileService.js
import api from "../config/api";

const profileService = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get("/api/profiles/profile//");
    return response.data;
  },

  // Update user profile (without file)
  updateProfile: async (profileData) => {
    const response = await api.put("/api/profiles/profile/", profileData);
    return response.data;
  },

  // Update profile with CV upload (multipart/form-data)
  updateProfileWithCV: async (formData) => {
    const response = await api.put("/api/profiles/profile/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Partial update user profile
  patchProfile: async (profileData) => {
    const response = await api.patch("/api/profiles/profile/", profileData);
    return response.data;
  },

  // Upload CV PDF only
  uploadCV: async (file) => {
    const formData = new FormData();
    formData.append("cv_pdf", file);

    const response = await api.patch("/api/profiles/profile/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Delete CV
  deleteCV: async () => {
    const response = await api.patch("/api/profiles/profile/", {
      cv_pdf: null,
    });
    return response.data;
  },

  // Get AI-generated profile suggestions (if backend provides this)
  getAISuggestions: async () => {
    const response = await api.get("/profiles/ai-suggestions/");
    return response.data;
  },

  // AI-powered CV analysis (if backend provides this)
  analyzeCV: async () => {
    const response = await api.post("/profiles/analyze-cv/");
    return response.data;
  },
};

export default profileService;
