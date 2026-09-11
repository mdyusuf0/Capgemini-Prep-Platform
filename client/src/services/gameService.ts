import api from './api';

export interface GameScorePayload {
  gameType: string;
  level: number;
  score: number;
  accuracy: number;
  timeSpent: number;
}

export const gameService = {
  saveScore: async (payload: GameScorePayload) => {
    const response = await api.post('/games/score', payload);
    return response.data;
  },

  getUserScores: async () => {
    const response = await api.get('/games/scores');
    return response.data;
  },

  getLeaderboard: async (gameType: string) => {
    const response = await api.get(`/games/leaderboard/${gameType}`);
    return response.data;
  }
};
