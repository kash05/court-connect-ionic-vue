import api from '@/lib/apiClient';
import { UserRoleInterface } from '@/types/userInterface';
import { SystemConfigInterface } from '../types/properyInterface';

export type SystemDataInterface = {
    roles: SystemConfigInterface[];
    sports: SystemConfigInterface[];
    amenities: SystemConfigInterface[];
    facilities: SystemConfigInterface[];
};

export const SystemData: SystemDataInterface = {
    roles: [],
    sports: [],
    amenities: [],
    facilities: [],
};

export const getRoles = () =>
    api
        .get<SystemConfigInterface[]>('/users/roles')
        .then((res) => (SystemData.roles = res.data));

export const getSports = () =>
    api
        .get<SystemConfigInterface[]>('/sports')
        .then((res) => (SystemData.sports = res.data));

export const getAmenities = () =>
    api
        .get<SystemConfigInterface[]>('/amenities')
        .then((res) => (SystemData.amenities = res.data));

export const getFacilities = () =>
    api
        .get<SystemConfigInterface[]>('/facilites')
        .then((res) => (SystemData.facilities = res.data));
