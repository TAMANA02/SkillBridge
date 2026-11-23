import api from './api';

export const studentService = {
  list: (params = {}) => api.get('/students/', { params }),
  get: (id) => api.get(`/students/${id}/`),
  getMe: () => api.get('/students/me/'),
  updateMe: (id, data) => api.patch(`/students/${id}/`, data),
  search: (params = {}) => api.get('/students/search/', { params }),
  leaderboard: () => api.get('/students/leaderboard/'),
  publicProfile: (userId) => api.get(`/students/${userId}/public_profile/`),
};
