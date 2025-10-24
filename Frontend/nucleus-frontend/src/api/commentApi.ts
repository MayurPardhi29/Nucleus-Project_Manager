// api/commentApi.ts
import axiosClient from './axiosClient';
import type { Comment, CommentCreateRequest } from '../types/Comment';

export const commentApi = {
  // Get comments for a specific issue
  getCommentsByIssue: (issueId: number) => 
    axiosClient.get(`/api/comments/issue/${issueId}`),
  
  // Create a new comment
  createComment: (commentData: CommentCreateRequest) => 
    axiosClient.post('/api/comments', commentData),
  
  // Update a comment
  updateComment: (id: number, commentData: { content: string }) => 
    axiosClient.put(`/api/comments/${id}`, commentData),
  
  // Delete a comment
  deleteComment: (id: number) => 
    axiosClient.delete(`/api/comments/${id}`),
};