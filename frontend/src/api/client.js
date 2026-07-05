import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 60000,
});

// Health API
export const healthCheck = () => api.get('/health');

// Logs API
export const saveLogs = (data) => api.post('/api/logs', data);
export const getLogs = (days = 30) => api.get(`/api/logs?days=${days}`);
export const deleteLog = (date) => api.delete(`/api/logs/${date}`);
export const getStats = (days = 7) => api.get(`/api/stats?days=${days}`);

// Chat API
export const sendChatMessage = (message, threadId = 'default') =>
  api.post('/api/chat', { message, thread_id: threadId });
export const clearChatHistory = (threadId = 'default') =>
  api.delete('/api/chat/clear', { data: { thread_id: threadId } });

// Analysis API
export const runAnalysis = (days = 30) =>
  api.post('/api/analyze', { days });

// Report API
export const generateReport = (periodStart, periodEnd) =>
  api.post('/api/report', { period_start: periodStart, period_end: periodEnd });
export const getReports = (limit = 10) =>
  api.get(`/api/reports?limit=${limit}`);

// Quick Insight API
export const getQuickInsight = () => api.get('/api/insight');

export default api;
