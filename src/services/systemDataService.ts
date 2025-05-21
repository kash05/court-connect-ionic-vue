import api from '@/lib/apiClient';
import { UserRoleInterface } from '@/types/userInterface';

export type SystemDataInterface = {
  roles: UserRoleInterface[];
};

export const SystemData: SystemDataInterface = {
  roles: [],
};

export const getRoles = () =>
  api
    .get<UserRoleInterface[]>('/users/roles')
    .then((res) => (SystemData.roles = res.data));
