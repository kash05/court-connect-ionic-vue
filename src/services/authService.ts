import api from '@/lib/apiClient';
import type {
  LoginCredentials,
  RegisterInterface,
  TokenResponse,
} from '@/types/authInterface';

const CLIENTID = import.meta.env.VITE_CLIENT_ID;
const CLIENTSECRET = import.meta.env.VITE_CLIENT_SECRET;

export const currentUser = () =>
  api.get('/users/profile').then((res) => res.data);

export const login = (data: Pick<LoginCredentials, 'email' | 'password'>) => {
  const loginData = {
    email: data.email,
    password: data.password,
    client_id: CLIENTID,
    client_secret: CLIENTSECRET,
    grant_type: 'password',
  };

  return api
    .post<TokenResponse>('/oauth/token', loginData)
    .then((response) => response.data);
};

export const registerUser = (data: RegisterInterface) =>
  api.post<RegisterInterface>('/users/register', data).then((response) => {
    return response.data;
  });

export const resetPassword = (data: any) =>
  api.post('/user/reset-password', data).then((response) => {
    return response.data;
  });

export const validateToken = () =>
  api.get('/user/validate-token').then((response) => response.data);

export const logout = () => {
  api.post('/user/logout');
};
