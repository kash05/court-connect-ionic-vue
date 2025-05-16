export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  birthdate?: string;
  bio?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  profileImage?: string;
  sports?: string[];
  position?: string;
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
    color: string;
  };
}
