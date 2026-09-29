import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
});

// Attach JWT token to requests if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('org_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle unauthorized responses automatically
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on authentication expiry
      if (window.location.pathname !== '/login' && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('org_token');
        localStorage.removeItem('org_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
