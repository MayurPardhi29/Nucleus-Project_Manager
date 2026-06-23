// api/axiosClient.ts
import axios from 'axios';
import type { ApiResponse, ListApiResponse } from '../types/Api';
import type { Project, ProjectCreateRequest, ProjectUpdateRequest } from '../types/Project';
import type { Issue, IssueCreateRequest, IssueUpdateRequest } from '../types/Issue';
import type { User, UserCreateRequest, UserUpdateRequest } from '../types/User';
import type { AuthResponseData, LoginRequest } from '../types/Auth';
import type { CommentCreateRequest } from '../types/Comment';

const BASE_URL = 'http://localhost:8080';
// const BASE_URL = window.location.origin; 

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Auth endpoints
  auth: {
    login: (credentials: LoginRequest) =>
      axiosClient.post<ApiResponse<AuthResponseData>>('/api/auth/login', credentials),

    logout: () => 
      axiosClient.post<ApiResponse<string>>('/api/auth/logout'),
  },

  // User endpoints
  users: {
    getAll: () => 
      axiosClient.get<ListApiResponse<User>>('/api/users'),
    
    getById: (id: number) => 
      axiosClient.get<ApiResponse<User>>(`/api/users/${id}`),
    
    create: (userData: UserCreateRequest) => 
      axiosClient.post<ApiResponse<User>>('/api/users', userData),
    
    update: (id: number, userData: UserUpdateRequest) => 
      axiosClient.put<ApiResponse<User>>(`/api/users/${id}`, userData),
    
    delete: (id: number) => 
      axiosClient.delete<ApiResponse<string>>(`/api/users/${id}`),
  },

  // Project endpoints
  projects: {
    getAll: () => 
      axiosClient.get<ListApiResponse<Project>>('/api/projects'),
    
    getById: (id: number) => 
      axiosClient.get<ApiResponse<Project>>(`/api/projects/${id}`),
    
    getByKey: (key: string) => 
      axiosClient.get<ApiResponse<Project>>(`/api/projects/key/${key}`),
    
    create: (projectData: ProjectCreateRequest) => 
      axiosClient.post<ApiResponse<Project>>('/api/projects', projectData),
    
    update: (id: number, projectData: ProjectUpdateRequest) => 
      axiosClient.put<ApiResponse<Project>>(`/api/projects/${id}`, projectData),
    
    delete: (id: number) => 
      axiosClient.delete<ApiResponse<string>>(`/api/projects/${id}`),
  },

  // Issue endpoints
  issues: {
    getAll: () => 
      axiosClient.get<ListApiResponse<Issue>>('/api/issues'),
    
    getById: (id: number) => 
      axiosClient.get<ApiResponse<Issue>>(`/api/issues/${id}`),
    
    getByKey: (key: string) => 
      axiosClient.get<ApiResponse<Issue>>(`/api/issues/key/${key}`),
    
    create: (issueData: IssueCreateRequest) => 
      axiosClient.post<ApiResponse<Issue>>('/api/issues', issueData),
    
    update: (id: number, issueData: IssueUpdateRequest) => 
      axiosClient.put<ApiResponse<Issue>>(`/api/issues/${id}`, issueData),
    
    delete: (id: number) => 
      axiosClient.delete<ApiResponse<string>>(`/api/issues/${id}`),
    
    search: (status: string) => 
      axiosClient.get<ListApiResponse<Issue>>(`/api/issues/search?status=${status}`),
  },

  // Comments endpoints
  comments: {
    getCommentsByIssue: (issueId: number) => 
      axiosClient.get(`/api/comments/issue/${issueId}`),
    
    createComment: (commentData: CommentCreateRequest) => 
      axiosClient.post('/api/comments', commentData),
    
    updateComment: (id: number, commentData: { content: string }) => 
      axiosClient.put(`/api/comments/${id}`, commentData),
    
    deleteComment: (id: number) => 
      axiosClient.delete(`/api/comments/${id}`),
  }
};

export default axiosClient;