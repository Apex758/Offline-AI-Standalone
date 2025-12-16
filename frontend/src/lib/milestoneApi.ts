import axios from 'axios';
import type { Milestone, MilestoneUpdate, ProgressSummary, MilestoneStats } from '../types/milestone';

const API_URL = 'http://localhost:8000/api/milestones';

export const milestoneApi = {
  // Initialize milestones for a teacher
  initialize: async (teacherId: string) => {
    const response = await axios.post(`${API_URL}/initialize/${teacherId}`);
    return response.data;
  },

  // Get all milestones with optional filters
  getMilestones: async (
    teacherId: string,
    filters?: {
      grade?: string;
      subject?: string;
      status?: string;
      include_hidden?: boolean;
    }
  ) => {
    const params = new URLSearchParams();
    if (filters?.grade) params.append('grade', filters.grade);
    if (filters?.subject) params.append('subject', filters.subject);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.include_hidden) params.append('include_hidden', 'true');

    const response = await axios.get(`${API_URL}/${teacherId}?${params.toString()}`);
    return response.data.milestones as Milestone[];
  },

  // Get progress summary
  getProgress: async (teacherId: string) => {
    const response = await axios.get(`${API_URL}/${teacherId}/progress`);
    return response.data;
  },

  // Get upcoming milestones
  getUpcoming: async (teacherId: string, days: number = 7) => {
    const response = await axios.get(`${API_URL}/${teacherId}/upcoming?days=${days}`);
    return response.data.milestones as Milestone[];
  },

  // Update a milestone
  updateMilestone: async (milestoneId: string, update: MilestoneUpdate) => {
    const response = await axios.patch(`${API_URL}/${milestoneId}`, update);
    return response.data.milestone as Milestone;
  },

  // Bulk reset for new year
  bulkReset: async (teacherId: string, archive: boolean = true) => {
    const response = await axios.post(`${API_URL}/bulk-reset`, {
      teacher_id: teacherId,
      archive
    });
    return response.data;
  },

  // Get stats for analytics dashboard
  getStats: async (teacherId: string) => {
    const response = await axios.get(`${API_URL}/${teacherId}/stats`);
    return response.data as MilestoneStats;
  }
};