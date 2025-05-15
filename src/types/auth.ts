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

export interface RegisterPlayerData {
  email: string;
  password: string;
  name: string;
  birthdate: string;
  phone: string;
  agreeTerms: boolean;
}

export interface RegisterInterface {
  email: string;
  password: string;
  name: string;
  gender: string;
  agreeTerms: boolean;
}
