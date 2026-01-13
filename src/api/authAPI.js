import axiosClient from './axiosClient';

const authAPI = {
  // Email/Password login (admin only)
  login: (email, password) => {
    return axiosClient.post('/auth/login', { email, password });
  },

  // Google OAuth authentication - DISABLED
  // googleAuth: (credential) => {
  //   return axiosClient.post('/auth/google', { credential });
  // },

  getMe: () => {
    // Normalize response to return the nested data object { user }
    return axiosClient.get('/auth/me').then((res) => res.data?.data || res.data);
  },

  updateProfile: (userData) => {
    return axiosClient.put('/auth/profile', userData);
  },

  addAddress: (addressData) => {
    return axiosClient.post('/auth/address', addressData);
  },

  deleteAddress: (addressId) => {
    return axiosClient.delete(`/auth/address/${addressId}`);
  },

  // Utility function to check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Utility function to get user role
  getUserRole: async () => {
    try {
      const response = await authAPI.getMe();
      return response.user;
    } catch (error) {
      return null;
    }
  },
};

export default authAPI;