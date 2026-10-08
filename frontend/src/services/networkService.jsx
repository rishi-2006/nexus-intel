import axiosClient from '../api/axiosClient';

export const networkService = {
  getNetworkGraph: async (caseId = null) => {
    const params = caseId ? { caseId } : {};
    const res = await axiosClient.get('/network', { params });
    return res.data;
  },
  getShortestPath: async (source, target) => {
    const res = await axiosClient.get('/network/shortest-path', {
      params: { source, target }
    });
    return res.data;
  }
};
