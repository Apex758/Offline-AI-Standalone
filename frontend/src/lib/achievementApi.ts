import axios from 'axios';
import type { AchievementDefinition, AchievementCheckResult, AchievementStats, AchievementCollection } from '../types/achievement';

const API_URL = 'http://localhost:8000/api/achievements';

export const achievementApi = {
  getDefinitions: async (): Promise<AchievementDefinition[]> => {
    const response = await axios.get(`${API_URL}/definitions`);
    return response.data;
  },

  getCollections: async (): Promise<AchievementCollection[]> => {
    const response = await axios.get(`${API_URL}/collections`);
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

  getShowcase: async (teacherId: string): Promise<string[]> => {
    const response = await axios.get(`${API_URL}/showcase/${teacherId}`);
    return response.data;
  },

  updateShowcase: async (teacherId: string, achievementIds: string[]): Promise<void> => {
    await axios.put(`${API_URL}/showcase/${teacherId}`, { achievement_ids: achievementIds });
  },
};
