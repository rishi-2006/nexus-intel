import axiosClient from '../api/axiosClient';

export const dataService = {
  importFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axiosClient.post('/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  }
};
