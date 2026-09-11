import api from './api';

export interface DebuggingProblem {
  _id: string;
  title: string;
  description: string;
  buggyCode: string;
  language: string;
  bugType: string;
  difficulty: string;
  hints: string[];
  explanation?: string;
  fixedCode?: string;
}

export const debuggingService = {
  getProblems: async (params?: any) => {
    const res = await api.get('/debugging', { params });
    return res.data;
  },
  
  getProblemById: async (id: string) => {
    const res = await api.get(`/debugging/${id}`);
    return res.data;
  },
  
  getTimedSet: async () => {
    const res = await api.get('/debugging/timed-set');
    return res.data;
  },
  
  submitFix: async (id: string, fixedCode: string) => {
    const res = await api.post(`/debugging/${id}/submit`, { fixedCode });
    return res.data;
  }
};
