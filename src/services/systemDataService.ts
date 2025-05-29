import api from '@/lib/apiClient';
import { UserRoleInterface } from '@/types/userInterface';
import { SportsData } from '../types/properyInterface';
import { Amenities } from '../types/addPropertyInterface';

export type SystemDataInterface = {
  roles: UserRoleInterface[];
  sports: SportsData[];
  amenities: Amenities[];
};

export const SystemData: SystemDataInterface = {
  roles: [],
  sports: [],
  amenities: [],
};

export const getRoles = () =>
  api
    .get<UserRoleInterface[]>('/users/roles')
    .then((res) => (SystemData.roles = res.data));

export const getSports = () =>
  api
    .get<SportsData[]>('/sports')
    .then((res) => (SystemData.sports = res.data));

export const getAmenities = () =>
  api
    .get<Amenities[]>('/amenities')
    .then((res) => (SystemData.amenities = res.data));
