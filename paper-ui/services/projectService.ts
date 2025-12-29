import axios from './axios';
import { getApiUrl } from './config';

const API_BASE_URL = getApiUrl('api/paper');

export interface ProjectDTO {
  id: number;
  userId: number;
  title: string | null;
  status: string;
  createdAt: string;
}

export const projectService = {
  async createProject(): Promise<ProjectDTO> {
    try {
      const response = await axios.post(`${API_BASE_URL}/projects/create`);

      // Handle standardized wrapped response
      if (response.data && response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Create project failed');
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  async getProject(id: string): Promise<ProjectDTO> {
    const response = await axios.get(`${API_BASE_URL}/projects/${id}`);
    return response.data.data;
  },

  async listProjects(): Promise<ProjectDTO[]> {
    try {
      const url = `${API_BASE_URL}/projects/list`;
      const response = await axios.get(url);

      // Handle standardized wrapped response
      if (response.data && response.data.code === 200) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'List projects failed');
    } catch (error) {
      console.error("API Error:", error);
      return []; // Return empty array on error to prevent crashes
    }
  }
};
