import api from '@/lib/apiClient';
import type { User, LoginCredentials, RegisterInterface } from '@/types/auth';

export const fetchUser = () =>
  api
    .get('/user')
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

export const login = (data: LoginCredentials) =>
  api
    .post<{ user: User; token: string }>('/login', data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });

export const registerUser = (data: RegisterInterface) =>
  api
    .post<{ user: User; token: string }>('/register', data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });

export const resetPassword = (data: any) =>
  api
    .post('/auth/reset-password', data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });

export const validateToken = () =>
  api
    .get<{ user: User }>('/auth/validate-token')
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });

export const logout = () => {
  api.post('/auth/logout').catch((error) => {
    throw error;
  });
};
