// types/Auth.ts
export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
  timestamp: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  email: string;
  token: string;
  expiresIn: number;
  username: string;
  role: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  displayName?: string;
  role: UserRole;
}

//new
export interface AuthResponseData {
  token: string;
  expiresIn: number;
  username: string;
  email: string;
  role: UserRole;
}

export interface RegisterResponseData {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
  createdAt?: string;
}
//
// export interface AuthResponse {
//   token: string;
//   expiresIn: number;
//   username: string;
//   email: string;
//   role: UserRole;
// }

export interface ForgotPasswordRequest {
  username: string;
  newPassword: string;
  confirmPassword: string;
}

export type UserRole = 'SUPER_ADMIN' | 'ORG_ADMIN' | 'PROJECT_ADMIN' | 'DEVELOPER' | 'VIEWER';