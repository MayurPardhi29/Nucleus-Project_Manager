// api/projectApi.ts
import axiosClient from './axiosClient';
import type { 
  Project, 
  ProjectCreateRequest, 
  ProjectUpdateRequest,
  ProjectMember,
  AddMemberRequest
} from '../types/Project';

export const projectApi = {
  // Project endpoints
  getAll: () => 
    axiosClient.get<{ data: Project[] }>('/api/projects'),
  
  getById: (id: number) => 
    axiosClient.get<{ data: Project }>(`/api/projects/${id}`),
  
  getByKey: (key: string) => 
    axiosClient.get<{ data: Project }>(`/api/projects/key/${key}`),
  
  create: (projectData: ProjectCreateRequest) => 
    axiosClient.post<{ data: Project }>('/api/projects', projectData),
  
  update: (id: number, projectData: ProjectUpdateRequest) => 
    axiosClient.put<{ data: Project }>(`/api/projects/${id}`, projectData),
  
  delete: (id: number) => 
    axiosClient.delete(`/api/projects/${id}`),

  // Project Member endpoints
  getMembers: (projectId: number) => 
    axiosClient.get<{ data: ProjectMember[] }>(`/api/projects/${projectId}/members`),
  
  addMember: (projectId: number, memberData: AddMemberRequest) => 
    axiosClient.post(`/api/projects/${projectId}/members`, memberData),
  
  updateMemberRole: (projectId: number, userId: number, roleData: { role: string }) => 
    axiosClient.put(`/api/projects/${projectId}/members/${userId}`, roleData),
  
  removeMember: (projectId: number, userId: number) => 
    axiosClient.delete(`/api/projects/${projectId}/members/${userId}`)
};