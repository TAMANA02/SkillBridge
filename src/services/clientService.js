import api from './api';

export const clientService = {
  // Get current client profile
  getMyProfile: () => api.get('/clients/me/'),

  // Get all clients
  getClients: (page = 1) => api.get(`/clients/?page=${page}`),

  // Get client detail
  getClient: (id) => api.get(`/clients/${id}/`),

  // Update client profile
  updateProfile: (profileData) =>
    api.patch('/clients/me/', profileData),

  // Upload company logo
  uploadLogo: (file) => {
    const formData = new FormData();
    formData.append('company_logo', file);
    return api.patch('/clients/me/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};