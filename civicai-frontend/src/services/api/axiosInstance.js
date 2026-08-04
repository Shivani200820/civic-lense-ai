import axios from 'axios';
import { store } from '../../store/redux/store';
import { logout } from '../../store/redux/slices/authSlice';
import { showSnackbar } from '../../store/redux/slices/uiSlice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      // Handle 401 Unauthorized (Token expired or invalid)
      if (status === 401) {
        store.dispatch(logout());
        store.dispatch(showSnackbar({ message: 'Session expired. Please login again.', severity: 'error' }));
        window.location.href = '/login';
      } 
      // Handle 403 Forbidden
      else if (status === 403) {
        store.dispatch(showSnackbar({ message: 'You do not have permission to perform this action.', severity: 'error' }));
      } 
      // Handle Validation Errors (422) or Bad Request (400)
      else if (status === 422 || status === 400) {
        const errorMsg = data?.detail?.[0]?.msg || data?.message || 'Invalid data provided.';
        store.dispatch(showSnackbar({ message: errorMsg, severity: 'warning' }));
      } 
      // Server Errors
      else {
        store.dispatch(showSnackbar({ message: 'An unexpected error occurred.', severity: 'error' }));
      }
    } else {
      store.dispatch(showSnackbar({ message: 'Network error. Please check your connection.', severity: 'error' }));
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;