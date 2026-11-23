import api from './api';

export const feedService = {
  list: (params = {}) => api.get('/feed/', { params }),
  get: (id) => api.get(`/feed/${id}/`),
  create: (postData) => api.post('/feed/', postData),
  update: (id, postData) => api.patch(`/feed/${id}/`, postData),
  remove: (id) => api.delete(`/feed/${id}/`),
  like: (id) => api.post(`/feed/${id}/like/`),
  save: (id) => api.post(`/feed/${id}/save/`),
  share: (id) => api.post(`/feed/${id}/share/`),
  followAuthor: (id) => api.post(`/feed/${id}/follow-author/`),
  comments: (id) => api.get(`/feed/${id}/comments/`),
  comment: (id, body) => api.post(`/feed/${id}/comments/`, { body }),
};
