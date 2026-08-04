import axiosInstance from './axiosInstance';

export const authService = {
  // 1. Login (Requires application/x-www-form-urlencoded)
  login: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email); // FastAPI OAuth2 uses 'username' for email
    formData.append('password', password);
    
    const response = await axiosInstance.post('/api/v1/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data; // { access_token, token_type }
  },

  // 2. Get Profile (To fetch user role after login)
  getProfile: async () => {
    const response = await axiosInstance.get('/api/v1/users/profile');
    return response.data.data; // Extracting user object from ApiResponse wrapper
  },

  // 3. Register (Requires application/json)
  register: async (userData) => {
    const response = await axiosInstance.post('/api/v1/auth/register', userData);
    return response.data;
  },
};