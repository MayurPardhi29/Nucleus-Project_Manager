// types/User.ts
import type { UserRole } from './Auth';

export interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface UserCreateRequest {
  username: string;
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
}

export interface UserUpdateRequest {
  username?: string;
  email?: string;
  displayName?: string;
  role?: UserRole;
  isActive?: boolean;
}

// export interface LoginRequest {
//   username: string;
//   password: string;
// }

// export interface LoginResponse {
//   email: string;
//   token: string;
//   expiresIn: number;
//   username: string;
//   role: string;
// }

// export interface RegisterResponse {
//   id: number;
//   username: string;
//   email: string;
//   role: UserRole;
// }

// export interface AuthResponse<T> {
//   status: 'success' | 'error';
//   message: string;
//   data: T | null;
//   timestamp: string;
// }