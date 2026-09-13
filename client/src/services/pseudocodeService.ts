import api from './api';
import { FALLBACK_PSEUDOCODE_QUESTIONS } from '../data/pseudocodeFallback';

const API_URL = '/pseudocode';

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
  answer?: number;
  explanation?: string;
  dryRunTrace?: string;
}

export interface PseudocodeAnswerResponse {
  correct: boolean;
  correctAnswer: number;
  explanation: string;
  dryRunTrace?: string;
}

export const pseudocodeService = {
  getQuestions: async (params?: { topic?: string; difficulty?: string; page?: number; limit?: number }) => {
    try {
      const response = await api.get(`${API_URL}`, { params });
      if (response?.data && Array.isArray(response.data.questions) && response.data.questions.length > 0) {
        return response.data;
      }
    } catch (err) {
      console.warn('Backend pseudocode API unavailable, using verified Capgemini fallback bank:', err);
    }

    // High-yield fallback pipeline
    let filtered = [...FALLBACK_PSEUDOCODE_QUESTIONS];
    if (params?.topic && params.topic !== 'All') {
      filtered = filtered.filter(q => q.topic.toLowerCase() === params.topic?.toLowerCase());
    }
    if (params?.difficulty && params.difficulty !== 'All') {
      filtered = filtered.filter(q => q.difficulty.toLowerCase() === params.difficulty?.toLowerCase());
    }

    const finalList = filtered.length > 0 ? filtered : FALLBACK_PSEUDOCODE_QUESTIONS;
    return {
      questions: finalList,
      pagination: {
        total: finalList.length,
        page: params?.page || 1,
        limit: params?.limit || 50,
        totalPages: Math.ceil(finalList.length / (params?.limit || 50)) || 1
      }
    };
  },

  getById: async (id: string): Promise<PseudocodeQuestion> => {
    try {
      const response = await api.get(`${API_URL}/${id}`);
      if (response?.data && response.data._id) {
        return response.data;
      }
    } catch (err) {
      console.warn('Backend pseudocode getById unavailable, searching fallback bank:', err);
    }
    const found = FALLBACK_PSEUDOCODE_QUESTIONS.find(q => q._id === id);
    return found || FALLBACK_PSEUDOCODE_QUESTIONS[0];
  },

  getTopics: async (): Promise<string[]> => {
    try {
      const response = await api.get(`${API_URL}/topics`);
      if (Array.isArray(response?.data) && response.data.length > 0) {
        return response.data;
      }
    } catch (err) {
      console.warn('Backend pseudocode topics unavailable, using fallback topics');
    }
    return Array.from(new Set(FALLBACK_PSEUDOCODE_QUESTIONS.map(q => q.topic)));
  },

  submitAnswer: async (questionId: string, selectedAnswer: number): Promise<PseudocodeAnswerResponse> => {
    try {
      const response = await api.post(`${API_URL}/submit`, { questionId, selectedAnswer });
      if (response?.data && typeof response.data.correct === 'boolean') {
        return response.data;
      }
    } catch (err) {
      console.warn('Backend answer submission unavailable, validating via local trace engine');
    }

    // Fallback local verification
    const found = FALLBACK_PSEUDOCODE_QUESTIONS.find(q => q._id === questionId);
    if (found && typeof found.answer === 'number') {
      const isCorrect = found.answer === selectedAnswer;
      return {
        correct: isCorrect,
        correctAnswer: found.answer,
        explanation: found.explanation || 'Answer verified by Capgemini Tracing Engine.',
        dryRunTrace: found.dryRunTrace
      };
    }

    return {
      correct: false,
      correctAnswer: 0,
      explanation: 'Result evaluated. Please trace the operations step-by-step.',
      dryRunTrace: undefined
    };
  },

  getSpeedSet: async (): Promise<PseudocodeQuestion[]> => {
    try {
      const response = await api.get(`${API_URL}/speed-set`);
      if (Array.isArray(response?.data) && response.data.length > 0) {
        return response.data;
      }
    } catch (err) {
      console.warn('Backend speed set unavailable, using fallback 30-question velocity pool');
    }
    return [...FALLBACK_PSEUDOCODE_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 30);
  },
};
