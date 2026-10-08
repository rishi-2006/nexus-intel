import axiosClient from '../api/axiosClient';

export const auditService = {
  getLogs: async (params = {}) => {
    const res = await axiosClient.get('/audit-logs', { params });
    return res.data;
  }
};
