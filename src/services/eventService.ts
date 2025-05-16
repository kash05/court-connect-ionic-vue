import api from '@/lib/apiClient';
import { Event } from '@/types/eventInterface';

export const getEvents = (filters?: { type?: string; date?: string }) =>
  api
    .get<Event[]>('/events', { params: filters })
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

export const getEventById = (id: string) =>
  api
    .get<Event>(`/events/${id}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });

export const createEvent = (data: Partial<Event>) =>
  api
    .post<Event>('/events', data)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
