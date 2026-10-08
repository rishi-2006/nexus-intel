import axiosClient from '../api/axiosClient';

export const anomalyService = {
  getAnomalies: async (params = {}) => {
    const res = await axiosClient.get('/anomalies', { params });
    return res.data;
  },
  updateStatus: async (id, status) => {
    const res = await axiosClient.put(`/anomalies/${id}/status`, { status });
    return res.data;
  },
  triggerScan: async () => {
    const res = await axiosClient.post('/anomalies/scan');
    return res.data;
  }
};
