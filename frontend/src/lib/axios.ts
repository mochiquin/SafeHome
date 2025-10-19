import axios from 'axios'

/**
 * Create axios instance with default configuration
 */
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true, // Send cookies with cross-origin requests
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request interceptor to add authentication tokens
 */
api.interceptors.request.use(
  (config) => {
    // For cookie-based authentication, we don't need to manually add Authorization header
    // The browser will automatically include cookies with requests to the same domain

    // Only add Authorization header if we have a token in localStorage (fallback)
    const token = localStorage.getItem('access_token')
    if (token && !document.cookie.includes('access_token=')) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

/**
 * Response interceptor for error handling and token refresh
 */
let isRefreshing = false;
let failedQueue: { resolve: (value?: any) => void; reject: (reason?: any) => void; }[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post('/auth/refresh/');
        processQueue(null, 'refreshed');
        return api(originalRequest);
      } catch (refreshError: any) {
        processQueue(refreshError, null);
        
        // If refresh fails, logout and redirect
        localStorage.removeItem('access_token'); // Clear any fallback token
        if (typeof window !== 'undefined') {
          // Avoid redirect loops
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data)
    }

    return Promise.reject(error)
  }
)

export default api

/**
 * Convenient HTTP methods
 */
export const http = {
  get: api.get,
  post: api.post,
  put: api.put,
  patch: api.patch,
  delete: api.delete,
}
