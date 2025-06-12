import api from '@/lib/apiClient';
import { Team } from '@/types/teamInterface';

export const getTeams = () =>
    api
        .get<Team[]>('/teams')
        .then((res) => res.data)
        .catch((error) => {
            throw error;
        });

export const getTeamById = (id: string) =>
    api
        .get<Team>(`/teams/${id}`)
        .then((res) => res.data)
        .catch((error) => {
            throw error;
        });

export const createTeam = (data: Partial<Team>) =>
    api
        .post<Team>('/teams', data)
        .then((res) => res.data)
        .catch((error) => {
            throw error;
        });

export const updateTeam = (id: string, data: Partial<Team>) =>
    api
        .put<Team>(`/teams/${id}`, data)
        .then((res) => res.data)
        .catch((error) => {
            throw error;
        });

export const deleteTeam = (id: string) =>
    api
        .delete(`/teams/${id}`)
        .then((res) => res.data)
        .catch((error) => {
            throw error;
        });
