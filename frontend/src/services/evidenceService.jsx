import axiosClient from '../api/axiosClient';

export const evidenceService = {
  getEvidence: async (params = {}) => {
    const res = await axiosClient.get('/evidence', { params });
    return res.data;
  },
  getEvidenceByCase: async (caseId) => {
    const res = await axiosClient.get(`/evidence/case/${caseId}`);
    return res.data;
  },
  getEvidenceById: async (id) => {
    const res = await axiosClient.get(`/evidence/${id}`);
    return res.data;
  },
  createEvidence: async (data) => {
    const res = await axiosClient.post('/evidence', data);
    return res.data;
  },
  updateEvidence: async (id, data) => {
    const res = await axiosClient.put(`/evidence/${id}`, data);
    return res.data;
  },
  deleteEvidence: async (id) => {
    await axiosClient.delete(`/evidence/${id}`);
  }
};
