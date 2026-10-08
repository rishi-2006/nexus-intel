import axiosClient from '../api/axiosClient';

export const entityService = {
  getEntities: async (params = {}) => {
    const res = await axiosClient.get('/entities', { params });
    return res.data;
  },
  getEntityById: async (id) => {
    const res = await axiosClient.get(`/entities/${id}`);
    return res.data;
  },
  getEntityByCode: async (code) => {
    const res = await axiosClient.get(`/entities/code/${code}`);
    return res.data;
  },
  createEntity: async (entityData) => {
    const res = await axiosClient.post('/entities', entityData);
    return res.data;
  },
  updateEntity: async (id, entityData) => {
    const res = await axiosClient.put(`/entities/${id}`, entityData);
    return res.data;
  },
  deleteEntity: async (id) => {
    await axiosClient.delete(`/entities/${id}`);
  }
};
