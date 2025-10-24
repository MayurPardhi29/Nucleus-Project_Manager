// types/Organization.ts
import type { User } from './User';

export interface Organization {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdBy: User;
  createdAt: string;
  projectCount?: number;
}

export interface OrganizationCreateRequest {
  name: string;
  slug: string;
  description?: string;
}

export interface OrganizationResponse {
  id: number;
  name: string;
  slug: string;
  description?: string;
  createdBy: User;
  createdAt: string;
  projectCount: number;
}

export interface OrganizationApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T | null;
  timestamp: string;
}