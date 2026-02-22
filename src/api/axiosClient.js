import axios from 'axios';

// Ensure the base URL ends with '/api' for external URLs
let API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// If the URL is an external URL (starts with http), ensure it ends with /api
if (API_BASE_URL.startsWith('http') && !API_BASE_URL.endsWith('/api')) {
  if (!API_BASE_URL.endsWith('/')) {
    API_BASE_URL += '/';
  }
  API_BASE_URL += 'api';
}

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15s timeout to prevent hanging requests
  headers: {
    'Accept': 'application/json',
  },
});

// re
// Request interceptor to add auth token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log API errors for debugging
    if (error.response?.status === 404) {
      console.warn('API endpoint not found:', error.config?.url);
    }
    
    if (error.response?.status === 401) {
      // Token expired or invalid: remove token and notify the app
      try {
        localStorage.removeItem('token');
        // Notify the app so the UI (redux/router) can handle logout centrally
        window.dispatchEvent(new CustomEvent('app:unauthorized', { detail: { status: 401 } }));
      } catch (e) {
        // ignore
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;