// lib/api.ts
import axios from 'axios';
import {IPersonalInfo,IEducation,IExperience,IJobApplication} from '@/types/jobTypes'

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
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
  createPersonalInfo: async (data: IPersonalInfo) => {
    const response = await api.post('/personal-info', data);
    return response.data;
  },

  addEducation: async (applicationId: string, data: IEducation) => {
    const response = await api.post(`/${applicationId}/education`, data);
    return response.data;
  },

  addExperience: async (applicationId: string, data: IExperience) => {
    const response = await api.post(`${applicationId}/experience`, data);
    return response.data;
  },

  submitApplication: async (applicationId: IJobApplication) => {
    const response = await api.post(`${applicationId}/submit`);
    return response.data;
  },

  getApplication: async (applicationId: string) => {
    const response = await api.get(`${applicationId}`);
    return response.data;
  },
};