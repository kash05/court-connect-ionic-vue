import { UserRole } from './enums/UserEnum';

export interface UserInterface {
    id: number | string;
    full_name: string;
    email: string;
    gender: string;
    agree_terms: boolean;
    role: UserRoleInterface;
    createdAt: string;
    updatedAt: string;
    profileImage?: string;
}

export interface UserRoleInterface {
    id: number;
    name: UserRole;
    display_name: string;
    created_at: string;
    updated_at: string;
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
