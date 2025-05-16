import axios from "axios";

const API_VERSION = import.meta.env.VITE_API_VERSION ?? "";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.url && !config.url.startsWith(`/${API_VERSION}`)) {
    config.url = `/${API_VERSION}${config.url}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;
