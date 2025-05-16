import api from '@/lib/apiClient';
import type {
  User,
  LoginCredentials,
  RegisterInterface,
} from '@/types/authInterface';

export const fetchUser = () =>
  api
    .get('/user')
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

export const login = (data: LoginCredentials) =>
  api
    .post<{ user: User; token: string }>('/user/login', data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });

export const registerUser = (data: RegisterInterface) =>
  api
    .post<RegisterInterface>('/user/register', data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });

export const resetPassword = (data: any) =>
  api
    .post('/user/reset-password', data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });

export const validateToken = () =>
  api
    .get<{ user: User }>('/user/validate-token')
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });

export const logout = () => {
  api.post('/user/logout').catch((error) => {
    throw error;
  });
};
