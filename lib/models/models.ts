export interface User {
  id?: string;
  username?: string;
  created_at?: string; // ISO date string
}

export interface RegisterRequest {
  username: string,
  password: string,
}

export interface LoginRequest {
  username: string,
  password: string,
}

export interface LoginResponse {
  token: string,
  user: User,
}

