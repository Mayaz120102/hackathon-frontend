import api from "../config/api";

/**
 * Example Service - Template for API services
 * Copy this file and modify for your specific backend endpoints
 */

export const userService = {
  // GET - Fetch all items
  getAll: async () => {
    const response = await api.get("/api/items/");
    return response.data;
  },

  // GET - Fetch single item by ID
  getById: async (id) => {
    const response = await api.get(`/api/items/${id}/`);
    return response.data;
  },

  // POST - Create new item
  create: async (data) => {
    const response = await api.post("/api/items/", data);
    return response.data;
  },

  // PUT - Update item
  update: async (id, data) => {
    const response = await api.put(`/api/items/${id}/`, data);
    return response.data;
  },

  // DELETE - Delete item
  delete: async (id) => {
    const response = await api.delete(`/api/items/${id}/`);
    return response.data;
  },
};
