import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Use your computer's local IP address so real Android devices can reach the backend
// Run `ipconfig` to find your IPv4 address if this changes
const API_BASE = 'http://192.168.100.22:3001/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 35000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('cl_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      await SecureStore.deleteItemAsync('cl_token');
      await SecureStore.deleteItemAsync('cl_user');
    }
    return Promise.reject(err);
  }
);

export const authService = {
  register: (name, email, password) => api.post('/auth/register', { name, email, password }).then(r => r.data),
  login: (email, password) => api.post('/auth/login', { email, password }).then(r => r.data),
  me: () => api.get('/auth/me').then(r => r.data),
  logout: () => api.post('/auth/logout').then(r => r.data),
};

export const predictionService = {
  predict: (inputs) => api.post('/predictions', inputs).then(r => r.data),
  history: (page = 1) => api.get(`/predictions/history?page=${page}`).then(r => r.data),
};

export const dataService = {
  getHotspots: (tier = null) => {
    const url = tier ? `/hotspots?tier=${tier}` : '/hotspots';
    return api.get(url).then(r => r.data);
  },
  getAreaProfiles: () => api.get('/hotspots/area-profiles').then(r => r.data),
  getHourlyTrends: () => api.get('/hotspots/trends/hourly').then(r => r.data),
  getMonthlyTrends: () => api.get('/hotspots/trends/monthly').then(r => r.data),
  getModelMetadata: () => api.get('/hotspots/metadata').then(r => r.data),
};

export default api;
