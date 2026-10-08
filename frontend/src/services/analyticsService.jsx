import axiosClient from '../api/axiosClient';

export const analyticsService = {
  getSummary: async () => {
    const res = await axiosClient.get('/analytics/summary');
    return res.data;
  }
};
