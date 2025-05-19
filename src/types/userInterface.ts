import { UserRole } from './enums/UserEnum';

export interface UserInterface {
  id: number | string;
  full_name: string;
  email: string;
  gender: string;
  agree_terms: boolean;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  profileImage?: string;
}

export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'team-only';
    showStats: boolean;
  };
  theme: {
    mode: 'light' | 'dark' | 'system';
  };
}
