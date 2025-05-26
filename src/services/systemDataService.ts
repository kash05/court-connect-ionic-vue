import api from '@/lib/apiClient';
import { UserRoleInterface } from '@/types/userInterface';
import { SportsData } from '../types/properyInterface';

export type SystemDataInterface = {
  roles: UserRoleInterface[];
  sports: SportsData[];
};

export const SystemData: SystemDataInterface = {
  roles: [],
  sports: [],
};

export const getRoles = () =>
  api
    .get<UserRoleInterface[]>('/users/roles')
    .then((res) => (SystemData.roles = res.data));

export const getSports = () =>
  api
    .get<SportsData[]>('/sports')
    .then((res) => (SystemData.sports = res.data));
