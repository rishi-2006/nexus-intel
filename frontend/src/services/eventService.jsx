import axiosClient from '../api/axiosClient';

export const eventService = {
  getAllEvents: async () => {
    const res = await axiosClient.get('/events');
    return res.data;
  },
  getEventsByCase: async (caseId, params = {}) => {
    const res = await axiosClient.get(`/events/case/${caseId}`, { params });
    return res.data;
  },
  getEventsByEntity: async (entityCode) => {
    const res = await axiosClient.get(`/events/entity/${entityCode}`);
    return res.data;
  },
  createEvent: async (data) => {
    const res = await axiosClient.post('/events', data);
    return res.data;
  },
  deleteEvent: async (id) => {
    await axiosClient.delete(`/events/${id}`);
  }
};
