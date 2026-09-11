import api from './api';

export const analyticsService = {
  getOverview: async () => {
    const response = await api.get('/analytics/overview');
    return response.data;
  },

  getCategoryStats: async (category: string) => {
    const response = await api.get(`/analytics/category/${category}`);
    return response.data;
  },

  getTrends: async () => {
    const response = await api.get('/analytics/trends');
    return response.data;
  },

  getWeakAreas: async () => {
    const response = await api.get('/analytics/weak-areas');
    return response.data;
  },

  getCoachAdvice: async () => {
    const response = await api.get('/analytics/coach-advice');
    return response.data;
  }
};
