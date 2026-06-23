// types/Project.ts
// import type { Organization } from './Organization';
import type { User } from './User';

export interface Project {
  id: number;
  name: string;
  description?: string;
  key: string;
  owner: User;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  issueCount: number;
  memberCount: number;
}

export interface ProjectCreateRequest {
  name: string;
  description?: string;
  key: string;
  isPrivate?: boolean;
}

export interface ProjectUpdateRequest {
  name?: string;
  description?: string;
  key?: string;
  isPrivate?: boolean;
}

export interface ProjectMember {
  id: number;
  user: User;
  role: ProjectRole;
  assignedAt: string;
}

export interface AddMemberRequest {
  userId: number;
  role: ProjectRole;
}

export type ProjectRole =
  | 'PROJECT_ADMIN'
  | 'DEVELOPER'
  | 'VIEWER';