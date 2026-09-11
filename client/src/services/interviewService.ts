import api from './api';

export const interviewService = {
  getQuestions: async (category: 'technical-interview' | 'hr-interview' | 'project-interview' = 'technical-interview') => {
    const response = await api.get(`/interview?category=${category}&limit=100`);
    return response.data.data || response.data.questions || [];
  }
};
