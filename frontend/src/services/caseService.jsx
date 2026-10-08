import axiosClient from '../api/axiosClient';

export const caseService = {
  getCases: async (params = {}) => {
    const res = await axiosClient.get('/cases', { params });
    return res.data;
  },
  getRecentCases: async () => {
    const res = await axiosClient.get('/cases/recent');
    return res.data;
  },
  getCaseById: async (id) => {
    const res = await axiosClient.get(`/cases/${id}`);
    return res.data;
  },
  createCase: async (caseData) => {
    const res = await axiosClient.post('/cases', caseData);
    return res.data;
  },
  updateCase: async (id, caseData) => {
    const res = await axiosClient.put(`/cases/${id}`, caseData);
    return res.data;
  },
  deleteCase: async (id) => {
    await axiosClient.delete(`/cases/${id}`);
  }
};

export default caseService;
