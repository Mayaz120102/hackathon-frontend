// src/services/aiService.js
import api from "../config/api";

const aiService = {
  // Get AI job recommendations
  getJobRecommendations: async () => {
    const response = await api.get("/ai/job/recommendation/");
    return response.data;
  },

  // Get gap analysis and learning suggestions
  getGapAnalysis: async () => {
    const response = await api.get(
      "/ai/gap-analysis-and-learning-suggestions/"
    );
    return response.data;
  },

  // Generate career roadmap
  generateRoadmap: async () => {
    const response = await api.get("/ai/roadmap/generator/");
    return response.data;
  },

  // Extract skills from CV/resume
  extractSkills: async (fileOrText) => {
    const formData = new FormData();
    if (typeof fileOrText === "string") {
      formData.append("text", fileOrText);
    } else {
      formData.append("file", fileOrText);
    }

    const response = await api.post("/extract-skills/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default aiService;
