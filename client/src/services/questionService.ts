import api from '@/services/api';

export interface Question {
  _id: string;
  questionText?: string;
  title?: string;
  description?: string;
  options: string[];
  category: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'easy' | 'medium' | 'hard';
  relevance?: number;
  sourceType?: string;
  answer?: number;
  explanation?: string;
  whyOthersWrong?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UserProgress {
  category: string;
  solvedCount: number;
  totalCount: number;
  accuracy: number;
}

export interface Bookmark {
  _id: string;
  itemType: string;
  itemId: any;
  createdAt: string;
}

export interface Mistake {
  _id: string;
  question: any;
  wrongOptionSelected: number;
  createdAt: string;
}

interface GetQuestionsParams {
  category?: string;
  topic?: string;
  difficulty?: string;
  relevance?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export const getQuestions = async (params: GetQuestionsParams): Promise<PaginatedResponse<Question>> => {
  const response = await api.get('/questions', { params });
  return response.data;
};

export const getQuestionById = async (id: string): Promise<Question> => {
  const response = await api.get(`/questions/${id}`);
  return response.data;
};

export const getTopics = async (category: string): Promise<string[]> => {
  const response = await api.get(`/questions/topics`, { params: { category } });
  return response.data;
};

export const submitAnswer = async (
  questionId: string,
  selectedAnswer: number
): Promise<{ correct: boolean; explanation: string; whyOthersWrong: string }> => {
  const response = await api.post(`/questions/${questionId}/submit`, { selectedAnswer });
  return response.data;
};

export const getProgress = async (): Promise<UserProgress[]> => {
  const response = await api.get('/users/progress');
  return response.data;
};

export const getDailyMission = async (): Promise<Question[]> => {
  const response = await api.get('/questions/daily-mission');
  return response.data;
};

export const addBookmark = async (itemType: string, itemId: string): Promise<void> => {
  await api.post('/bookmarks', { itemType, itemId });
};

export const removeBookmark = async (itemType: string, itemId: string): Promise<void> => {
  await api.delete(`/bookmarks/${itemType}/${itemId}`);
};

export const getBookmarks = async (): Promise<Bookmark[]> => {
  const response = await api.get('/bookmarks');
  return response.data;
};

export const getMistakes = async (): Promise<Mistake[]> => {
  const response = await api.get('/users/mistakes');
  return response.data;
};
