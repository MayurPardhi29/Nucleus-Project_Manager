// types/Comment.ts
import type { User } from './User';

export interface Comment {
  id: number;
  content: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface CommentCreateRequest {
  content: string;
  issueId: number;
}

export interface CommentApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T | null;
  timestamp: string;
}