// types/Issue.ts
// import type { User } from './User';
// import type { Project } from './Project';
export interface Issue {
  id: number;
  key: string;
  title: string;
  description?: string;
  type: IssueType;
  status: IssueStatus;
  priority: Priority;
  project: Project;
  reporter: User;
  assignee?: User;
  storyPoints?: number;
  timeEstimate?: number;
  timeSpent?: number;
  createdAt: string;
  updatedAt: string;
  commentCount: number;
}

export type IssueType = 'EPIC' | 'STORY' | 'TASK' | 'BUG' | 'SUBTASK';
export type IssueStatus = 'OPEN' | 'IN_PROGRESS' | 'CODE_REVIEW' | 'TESTING' | 'DONE' | 'CLOSED';
export type Priority = 'LOWEST' | 'LOW' | 'MEDIUM' | 'HIGH' | 'HIGHEST' | 'CRITICAL';

export interface IssueCreateRequest {
  title: string;
  description?: string;
  type: IssueType;
  status?: IssueStatus;
  priority?: Priority;
  projectId: number;
  assigneeId?: number;
  storyPoints?: number;
  timeEstimate?: number;
  parentIssueId?: number;
}

export interface IssueUpdateRequest {
  title?: string;
  description?: string;
  type?: IssueType;
  status?: IssueStatus;
  priority?: Priority;
  assigneeId?: number;
  storyPoints?: number;
  timeEstimate?: number;
  timeSpent?: number;
}

export interface IssueApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T | null;
  timestamp: string;
}