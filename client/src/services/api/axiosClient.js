import axios from 'axios';
import { toast } from 'react-toastify';

// Create axios instance with base configuration
const axiosClient = axios.create({
  baseURL: 'https://shopeaze-server.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token if available
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

// Response interceptor - Handle errors globally
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    
    if (response) {
      // Handle specific error status codes
      switch (response.status) {
        case 401:
          // Unauthorized error
          toast.error('Session expired. Please login again.');
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden error
          toast.error('You do not have permission to perform this action');
          break;
        case 404:
          // Not found error
          toast.error('Requested resource not found');
          break;
        case 500:
          // Server error
          toast.error('Server error. Please try again later.');
          break;
        default:
          // Other errors
          toast.error(response.data?.message || 'Something went wrong');
      }
    } else {
      // Network error
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient; 