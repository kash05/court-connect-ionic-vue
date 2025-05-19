export interface TokenResponse {
  access_token: string;
  expires_at: string;
  refresh_token: string;
  type: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  client_id: string;
  client_secret: string;
  grant_type: string;
}

export interface RegisterInterface {
  email: string;
  password: string;
  full_name: string;
  gender: string;
  agree_terms: boolean;
}
