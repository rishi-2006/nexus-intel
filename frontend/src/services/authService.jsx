import axiosClient from '../api/axiosClient';

export const authService = {
  login: async (email, password) => {
    const res = await axiosClient.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (userData) => {
    const res = await axiosClient.post('/auth/register', userData);
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await axiosClient.get('/auth/me');
    return res.data;
  },
  getAllUsers: async () => {
    const res = await axiosClient.get('/users');
    return res.data;
  },
  updateUserRole: async (userId, role) => {
    const res = await axiosClient.put(`/users/${userId}/role`, { role });
    return res.data;
  }
};

export default authService;
