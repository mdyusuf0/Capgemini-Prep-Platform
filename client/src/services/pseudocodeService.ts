import axios from 'axios';

const API_URL = '/api/pseudocode';

export interface PseudocodeQuestion {
  _id: string;
  question: string;
  codeBlock: string;
  options: string[];
  topic: string;
  subtopic?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  relevance: string;
  capgeminiRelevance: number;
  tags: string[];
}

export interface PseudocodeAnswerResponse {
  correct: boolean;
  correctAnswer: number;
  explanation: string;
  dryRunTrace?: string;
}

export const pseudocodeService = {
  getQuestions: async (params?: { topic?: string; difficulty?: string; page?: number; limit?: number }) => {
    const response = await axios.get(`${API_URL}`, { params });
    return response.data;
  },

  getById: async (id: string): Promise<PseudocodeQuestion> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  getTopics: async (): Promise<string[]> => {
    const response = await axios.get(`${API_URL}/topics`);
    return response.data;
  },

  submitAnswer: async (questionId: string, selectedAnswer: number): Promise<PseudocodeAnswerResponse> => {
    const response = await axios.post(`${API_URL}/submit`, { questionId, selectedAnswer });
    return response.data;
  },

  getSpeedSet: async (): Promise<PseudocodeQuestion[]> => {
    const response = await axios.get(`${API_URL}/speed-set`);
    return response.data;
  },
};
