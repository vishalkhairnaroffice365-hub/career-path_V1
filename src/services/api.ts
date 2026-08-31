import axios from 'axios';

// Resolve base API URL from Vite environment variable (fallback to default)
const API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:5000/api/v1'
  : 'https://career-path-backend-yyae.onrender.com/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('career_path_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: extract data or format error message
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If unauthorized, clean up token
    if (error.response && error.response.status === 401) {
      const isAuthRoute = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
      if (!isAuthRoute) {
        localStorage.removeItem('career_path_token');
      }
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';

    return Promise.reject(new Error(message));
  }
);
