import api from '@/lib/apiClient';
import type {
  LoginCredentials,
  RegisterInterface,
  TokenResponse,
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
    .post<TokenResponse>('/oauth/token', data)
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
    .get('/user/validate-token')
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });

export const logout = () => {
  api.post('/user/logout').catch((error) => {
    throw error;
  });
};
