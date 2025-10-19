import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export interface Item {
  id?: number;
  name: string;
  description?: string;
}

export const api = {
  items: {
    list: async () => {
      const response = await axios.get<Item[]>(`${API_URL}/items`);
      return response.data;
    },
    create: async (item: Item) => {
      const response = await axios.post<Item>(`${API_URL}/items`, item);
      return response.data;
    },
    get: async (id: number) => {
      const response = await axios.get<Item>(`${API_URL}/items/${id}`);
      return response.data;
    },
  },
};