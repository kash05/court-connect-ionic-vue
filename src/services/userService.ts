import api from '@/lib/apiClient';
import { UserProfile } from '@/types/user';

export const getCurrentUser = () =>
  api
    .get<UserProfile>('/users/me')
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

export const getUserById = (id: string) =>
  api
    .get<UserProfile>(`/users/${id}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

export const updateUser = (id: string, data: Partial<UserProfile>) =>
  api
    .put<UserProfile>(`/users/${id}`, data)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

export const deleteUser = (id: string) =>
  api
    .delete(`/users/${id}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
