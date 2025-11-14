// src/services/jobService.js
import api from "../config/api";

const jobService = {
  // Get all jobs (public)
  getAllJobs: async (params = {}) => {
    const response = await api.get("/api/jobs/", { params });
    return response.data;
  },

  // Get single job by ID (public)
  getJobById: async (id) => {
    const response = await api.get(`/api/jobs/${id}/`);
    return response.data;
  },

  // Search jobs with query (returns jobs + learning resources)
  searchJobs: async (searchTerm) => {
    const response = await api.get("/api/jobs/search/", {
      params: { q: searchTerm },
    });
    // Backend returns: { query: "...", results: { jobs: [...], learning_resources: [...] } }
    return {
      jobs: response.data.results?.jobs || [],
      learningResources: response.data.results?.learning_resources || [],
      query: response.data.query || searchTerm,
    };
  },

  // Filter jobs (skill, location, job_type)
  filterJobs: async (filters) => {
    const response = await api.get("/api/filter/jobs/", { params: filters });
    // Backend returns: { filters: {...}, results: [...] }
    return {
      jobs: response.data.results || [],
      appliedFilters: response.data.filters || {},
    };
  },

  // Admin: Get all jobs
  adminGetAllJobs: async () => {
    const response = await api.get("/api/admin/jobs/");
    return response.data;
  },

  // Admin: Create new job
  adminCreateJob: async (jobData) => {
    const response = await api.post("api/admin/jobs/", jobData);
    return response.data;
  },

  // Admin: Update job (full)
  adminUpdateJob: async (id, jobData) => {
    const response = await api.put(`api/admin/jobs/${id}/`, jobData);
    return response.data;
  },

  // Admin: Partial update job
  adminPatchJob: async (id, jobData) => {
    const response = await api.patch(`api/admin/jobs/${id}/`, jobData);
    return response.data;
  },

  // Admin: Delete job
  adminDeleteJob: async (id) => {
    const response = await api.delete(`api/admin/jobs/${id}/`);
    return response.data;
  },
};

export default jobService;
