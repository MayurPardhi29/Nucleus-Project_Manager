// api/projectApi.ts
import axiosClient from './axiosClient';
import type { 
  Project, 
  ProjectCreateRequest, 
  ProjectUpdateRequest,
  ProjectMember,
  AddMemberRequest,
  ProjectRole
} from '../types/Project';
import type{
  ApiResponse
} from '../types/Api';

export const projectApi = {
  // Project endpoints
  getAll: () => 
    axiosClient.get<ApiResponse<Project[]>>('/api/projects'),
  
  getById: (id: number) => 
    axiosClient.get<ApiResponse<Project>>(`/api/projects/${id}`),
  
  getByKey: (key: string) => 
    axiosClient.get<ApiResponse<Project>>(`/api/projects/key/${key}`),
  
  create: (projectData: ProjectCreateRequest) => 
    axiosClient.post<ApiResponse<Project>>('/api/projects', projectData),
  
  update: (id: number, projectData: ProjectUpdateRequest) => 
    axiosClient.put<ApiResponse<Project>>(`/api/projects/${id}`, projectData),
  
  delete: (id: number) => 
    axiosClient.delete(`/api/projects/${id}`),

  // Project Member endpoints
  getMembers: (projectId: number) => 
    axiosClient.get<{ data: ProjectMember[] }>(`/api/projects/${projectId}/members`),
  
  addMember: (projectId: number, memberData: AddMemberRequest) => 
    axiosClient.post(`/api/projects/${projectId}/members`, memberData),
  
  updateMemberRole: (
    projectId: number,
    userId: number,
    data: { role: ProjectRole }
  ) =>
    axiosClient.put(
      `/api/projects/${projectId}/members/${userId}/role`,
      data
    ),
  
    removeMember: (
      projectId: number,
      userId: number
    ) =>
      axiosClient.delete(
        `/api/projects/${projectId}/members/${userId}`
      ),
};