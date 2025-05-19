import { Preferences } from '@capacitor/preferences';
import axios from 'axios';

const API_VERSION = import.meta.env.VITE_API_VERSION ?? '';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

api.interceptors.request.use(
  async (config) => {
    const { value: token } = await Preferences.get({ key: 'token' });

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (config.url && !config.url.startsWith(`/${API_VERSION}`)) {
      config.url = `/${API_VERSION}${config.url}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      await Preferences.remove({ key: 'token' });
      await Preferences.remove({ key: 'user' });

      window.location.href = '/login';
    }

    return Promise.reject(error);
  },
);

export default api;
