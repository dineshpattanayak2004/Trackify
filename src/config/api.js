// Centralized API configuration
// Uses environment variable in production, localhost in development

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const api = {
  baseURL: API_URL,
  
  // Helper to get full API endpoint
  endpoint: (path) => `${API_URL}${path}`,
  
  // Socket.io connection URL
  socketURL: API_URL,
};

export default api;