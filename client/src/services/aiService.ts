import api from './api';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface AIConversation {
  _id: string;
  userId: string;
  context: string;
  problemId?: string;
  messages: ChatMessage[];
  assistanceLevel: number;
  promptCount: number;
  createdAt: string;
}

export const aiService = {
  startConversation: async (context: string, problemId?: string, assistanceLevel: number = 2) => {
    const response = await api.post('/ai/conversation', { context, problemId, assistanceLevel });
    return response.data.data as AIConversation;
  },

  sendMessage: async (conversationId: string, content: string) => {
    const response = await api.post('/ai/message', { conversationId, content });
    return response.data.data as AIConversation;
  },

  getConversation: async (id: string) => {
    const response = await api.get(`/ai/conversation/${id}`);
    return response.data.data as AIConversation;
  },

  getUsageStats: async () => {
    const response = await api.get('/ai/usage');
    return response.data.data as { totalPrompts: number, totalConversations: number };
  }
};
