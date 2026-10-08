import axiosClient from '../api/axiosClient';

export const relationshipService = {
  getRelationships: async (params = {}) => {
    const res = await axiosClient.get('/relationships', { params });
    return res.data;
  },
  getRelationshipsForEntity: async (entityId) => {
    const res = await axiosClient.get(`/relationships/entity/${entityId}`);
    return res.data;
  },
  createRelationship: async (data) => {
    const res = await axiosClient.post('/relationships', data);
    return res.data;
  },
  updateRelationship: async (id, data) => {
    const res = await axiosClient.put(`/relationships/${id}`, data);
    return res.data;
  },
  deleteRelationship: async (id) => {
    await axiosClient.delete(`/relationships/${id}`);
  }
};
