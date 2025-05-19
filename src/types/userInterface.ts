export interface UserInterface {
  id: number | string;
  full_name: string;
  email: string;
  gender: string;
  agree_terms: boolean;
  createdAt: string;
  updatedAt: string;
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
