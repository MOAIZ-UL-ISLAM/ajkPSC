import axios from "axios";
import { RegisterData, LoginData, ResetPasswordData } from "@/types/auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const API_URL = `${BASE_URL}/api`;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true // Important for CORS
});

// Request interceptor for adding token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  register: async (data: RegisterData) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  login: async (data: LoginData) => {
    try {
      // Use the api instance instead of hardcoding the URL
      const response = await api.post("/auth/login", data);
      
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response) {
        console.error('Error response:', error.response);
        throw new Error(error.response.data?.message || "Login failed");
      } else if (error.request) {
        console.error('Error request:', error.request);
        throw new Error("No response from server. Please check your connection.");
      } else {
        console.error('Error:', error.message);
        throw new Error("Error setting up the request");
      }
    }
  },

  forgotPassword: async (email: string) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (data: ResetPasswordData) => {
    const response = await api.post("/auth/reset-password", data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },
};

export default api;