import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({ baseURL: BASE });

export const getPhrases       = (params) => api.get('/phrases', { params }).then(r => r.data);
export const getCategories    = ()       => api.get('/phrases/categories').then(r => r.data);
export const getPhrase        = (id)     => api.get(`/phrases/${id}`).then(r => r.data);

export const getQuizzes       = ()       => api.get('/quizzes').then(r => r.data);
export const getQuiz          = (id)     => api.get(`/quizzes/${id}`).then(r => r.data);
export const getQuizQuestions = (id)     => api.get(`/quizzes/${id}/questions`).then(r => r.data);
export const validateQuiz     = (id, answers, sessionId) =>
  api.post(`/quizzes/${id}/validate`, { answers }, {
    headers: { 'x-session-id': sessionId },
  }).then(r => r.data);

// ── Admin API ─────────────────────────────────────────────────────────────────

const adminApi = axios.create({ baseURL: BASE });

adminApi.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const adminGetCounts      = ()        => adminApi.get('/admin/counts').then(r => r.data);

export const adminGetCategories  = ()        => adminApi.get('/admin/categories').then(r => r.data);
export const adminCreateCategory = (data)    => adminApi.post('/admin/categories', data).then(r => r.data);
export const adminUpdateCategory = (id, d)   => adminApi.put(`/admin/categories/${id}`, d).then(r => r.data);
export const adminDeleteCategory = (id)      => adminApi.delete(`/admin/categories/${id}`).then(r => r.data);

export const adminGetPhrases     = (params)  => adminApi.get('/admin/phrases', { params }).then(r => r.data);
export const adminCreatePhrase   = (data)    => adminApi.post('/admin/phrases', data).then(r => r.data);
export const adminUpdatePhrase   = (id, d)   => adminApi.put(`/admin/phrases/${id}`, d).then(r => r.data);
export const adminDeletePhrase   = (id)      => adminApi.delete(`/admin/phrases/${id}`).then(r => r.data);

export const adminGetQuizzes     = ()        => adminApi.get('/admin/quizzes').then(r => r.data);
export const adminCreateQuiz     = (data)    => adminApi.post('/admin/quizzes', data).then(r => r.data);
export const adminUpdateQuiz     = (id, d)   => adminApi.put(`/admin/quizzes/${id}`, d).then(r => r.data);
export const adminDeleteQuiz     = (id)      => adminApi.delete(`/admin/quizzes/${id}`).then(r => r.data);

export { adminApi };
