// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const jobApplicationApi = {
  createPersonalInfo: async (data: any) => {
    const response = await api.post('/applications/personal-info', data);
    return response.data;
  },

  addEducation: async (applicationId: string, data: any) => {
    const response = await api.post(`/applications/${applicationId}/education`, data);
    return response.data;
  },

  addExperience: async (applicationId: string, data: any) => {
    const response = await api.post(`/applications/${applicationId}/experience`, data);
    return response.data;
  },

  submitApplication: async (applicationId: string) => {
    const response = await api.post(`/applications/${applicationId}/submit`);
    return response.data;
  },

  getApplication: async (applicationId: string) => {
    const response = await api.get(`/applications/${applicationId}`);
    return response.data;
  },
};