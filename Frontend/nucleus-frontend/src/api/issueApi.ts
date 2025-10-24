import axiosClient from './axiosClient';
import { Issue } from '../types/Auth';

export const issueApi = {
  getAllIssues: (): Promise<Issue[]> => {
    return axiosClient.get('/issues');
  },
  
  getIssueById: (id: number): Promise<Issue> => {
    return axiosClient.get(`/issues/${id}`);
  },
  
  createIssue: (issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>): Promise<Issue> => {
    return axiosClient.post('/issues', issueData);
  },
  
  updateIssue: (id: number, issueData: Partial<Issue>): Promise<Issue> => {
    return axiosClient.put(`/issues/${id}`, issueData);
  },
  
  deleteIssue: (id: number): Promise<void> => {
    return axiosClient.delete(`/issues/${id}`);
  }
};