import api from './api';

export const teamService = {
  list: (params = {}) => api.get('/teams/', { params }),
  get: (slug) => api.get(`/teams/${slug}/`),
  register: (teamData) => api.post('/teams/', teamData),
  update: (id, teamData) => api.patch(`/teams/${id}/`, teamData),
  remove: (id) => api.delete(`/teams/${id}/`),
};
