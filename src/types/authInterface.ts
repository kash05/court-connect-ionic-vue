export interface User {
  id: string;
  email: string;
  name: string;
  role: 'player' | 'owner';
  profileImage?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterInterface {
  email: string;
  password: string;
  full_name: string;
  gender: string;
  agree_terms: boolean;
}
