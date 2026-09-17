import api from './api';

export const collegeService = {
  list: (params = {}) => api.get('/colleges/', { params }),
  get: (slug) => api.get(`/colleges/${slug}/`),
  leaderboard: (limit = 10) => api.get('/colleges/leaderboard/', { params: { limit } }),
};
