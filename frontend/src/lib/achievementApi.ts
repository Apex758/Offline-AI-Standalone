import axios from 'axios';
import type { AchievementDefinition, AchievementCheckResult, AchievementStats } from '../types/achievement';

const API_URL = 'http://localhost:8000/api/achievements';

export const achievementApi = {
  getDefinitions: async (): Promise<AchievementDefinition[]> => {
    const response = await axios.get(`${API_URL}/definitions`);
    return response.data;
  },

  check: async (teacherId: string): Promise<AchievementCheckResult> => {
    const response = await axios.post(`${API_URL}/check/${teacherId}`);
    return response.data;
  },

  getEarned: async (teacherId: string): Promise<AchievementStats> => {
    const response = await axios.get(`${API_URL}/${teacherId}`);
    return response.data;
  },
};
