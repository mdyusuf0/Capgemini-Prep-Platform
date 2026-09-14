import api from './api';

export interface MockTest {
  _id: string;
  title: string;
  type: string;
  sections: any[];
  totalTimeMinutes: number;
}

export interface MockAttempt {
  _id: string;
  mockTestId: MockTest | string;
  startedAt: string;
  status: string;
  score?: number;
  totalQuestions?: number;
}

export const mockService = {
  getMockTests: async () => {
    const res = await api.get('/mocks');
    return res.data;
  },
  
  generateMock: async (type: string, sections?: any[]) => {
    const res = await api.post('/mocks/generate', { type, sections });
    return res.data;
  },
  
  startMock: async (testId: string) => {
    const res = await api.post('/mocks/start', { testId });
    return res.data;
  },
  
  submitAnswer: async (data: any) => {
    const res = await api.post('/mocks/answer', data);
    return res.data;
  },
  
  completeMock: async (attemptId: string, answers: any[], timeSpent: number, sectionScores?: any[]) => {
    const res = await api.post('/mocks/complete', { attemptId, answers, timeSpent, sectionScores });
    return res.data;
  },
  
  getMockResult: async (id: string) => {
    const res = await api.get(`/mocks/${id}`);
    return res.data;
  },
  
  getHistory: async () => {
    const res = await api.get('/mocks/history');
    return res.data;
  }
};
