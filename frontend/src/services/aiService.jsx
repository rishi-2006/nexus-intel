import axiosClient from '../api/axiosClient';

export const aiService = {
  chat: async (query, caseId = null, entityCode = null) => {
    const res = await axiosClient.post('/ai/chat', {
      query,
      caseId,
      entityCode,
    });
    return res.data;
  }
};

export default aiService;
