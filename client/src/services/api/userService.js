import axiosClient from './axiosClient';

const userService = {
  // User authentication
  login: (credentials) => axiosClient.post('/user/login', credentials),
  register: (userData) => axiosClient.post('/user/register', userData),
  
  // User profile
  getCurrentUser: () => axiosClient.get('/user/profile'),
  updateProfile: (userData) => axiosClient.put('/user/profile', userData),
  
  // Password management
  changePassword: (data) => axiosClient.post('/user/change-password', data),
};

export default userService; 