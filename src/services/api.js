import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`.trim();
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
