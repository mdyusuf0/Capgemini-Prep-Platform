import api from './api';

export const interviewService = {
  getQuestions: async (category: 'technical-interview' | 'hr-interview') => {
    const response = await api.get(`/questions?category=${category}`);
    return response.data.questions || [];
  }
};
