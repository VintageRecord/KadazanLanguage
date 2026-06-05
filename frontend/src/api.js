import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
});

export const getPhrases    = (params) => api.get('/phrases', { params }).then(r => r.data);
export const getCategories = ()       => api.get('/phrases/categories').then(r => r.data);
export const getPhrase     = (id)     => api.get(`/phrases/${id}`).then(r => r.data);

export const getQuizzes    = ()       => api.get('/quizzes').then(r => r.data);
export const getQuiz       = (id)     => api.get(`/quizzes/${id}`).then(r => r.data);
export const getQuizQuestions = (id)  => api.get(`/quizzes/${id}/questions`).then(r => r.data);
export const validateQuiz  = (id, answers, sessionId) =>
  api.post(`/quizzes/${id}/validate`, { answers }, {
    headers: { 'x-session-id': sessionId },
  }).then(r => r.data);
