// types/Auth.ts

export type UserRole =
  | 'SUPER_ADMIN'
  | 'PROJECT_ADMIN'
  | 'DEVELOPER'
  | 'VIEWER';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponseData {
  token: string;
  expiresIn: number;
  username: string;
  email: string;
  role: UserRole;
}