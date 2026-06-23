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
