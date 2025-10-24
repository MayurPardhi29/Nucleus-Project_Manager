import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axiosClient';
import type { Project, ProjectCreateRequest, ProjectUpdateRequest, ProjectMember, AddMemberRequest } from '../types/Project';

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPrivacy, setFilterPrivacy] = useState<'all' | 'public' | 'private'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt' | 'issueCount'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showMembers, setShowMembers] = useState(false);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ProjectCreateRequest>({
    name: '',
    description: '',
    key: '',
    organizationId: 1,
    isPrivate: false
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching projects...');
      const response = await api.projects.getAll();
      console.log('Projects API response:', response);
      
      if (response.data && response.data.status === 'success') {
        setProjects(response.data.data || []);
        console.log('Projects set:', response.data.data || []);
      } else {
        setError('Failed to load projects');
        console.error('Unexpected response format:', response.data);
      }
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load projects';
      setError(errorMessage);
      setProjects([]); // Ensure projects is always an array
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectMembers = async (projectId: number) => {
    setLoadingMembers(true);
    try {
      const response = await api.projects.getMembers(projectId);
      if (response.data && response.data.status === 'success') {
        setMembers(response.data.data || []);
      }
    } catch (error: any) {
      console.error('Error fetching project members:', error);
      alert(error.response?.data?.message || 'Failed to load members');
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate form data
    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }
    if (!formData.key.trim()) {
      setError('Project key is required');
      return;
    }

    try {
      console.log('Creating project with data:', formData);
      const response = await api.projects.create(formData);
      console.log('Create project response:', response);

      if (response.data && response.data.status === 'success') {
        console.log('Project created successfully');
        setShowCreateForm(false);
        setFormData({ name: '', description: '', key: '', organizationId: 1, isPrivate: false });
        
        // Add the new project to the list immediately for better UX
        if (response.data.data) {
          setProjects(prev => [response.data.data, ...prev]);
        } else {
          // If no data in response, refetch
          await fetchProjects();
        }
      } else {
        const errorMsg = response.data?.message || 'Failed to create project';
        setError(errorMsg);
        console.error('Create project failed:', response.data);
      }
    } catch (error: any) {
      console.error('Error creating project:', error);
      console.error('Error details:', error.response);
      const errorMsg = error.response?.data?.message || 'Failed to create project. Please try again.';
      setError(errorMsg);
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setError('');
    try {
      const updateData: ProjectUpdateRequest = {
        name: formData.name,
        description: formData.description,
        key: formData.key,
        isPrivate: formData.isPrivate
      };
      
      const response = await api.projects.update(editingProject.id, updateData);
      
      if (response.data && response.data.status === 'success') {
        setEditingProject(null);
        setFormData({ name: '', description: '', key: '', organizationId: 1, isPrivate: false });
        await fetchProjects(); // Refresh the list
      } else {
        setError(response.data?.message || 'Failed to update project');
      }
    } catch (error: any) {
      console.error('Error updating project:', error);
      setError(error.response?.data?.message || 'Failed to update project');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await api.projects.delete(id);
      if (response.data && response.data.status === 'success') {
        setDeleteConfirm(null);
        // Remove the project from the list immediately
        setProjects(prev => prev.filter(project => project.id !== id));
      } else {
        alert(response.data?.message || 'Failed to delete project');
      }
    } catch (error: any) {
      console.error('Error deleting project:', error);
      alert(error.response?.data?.message || 'Failed to delete project');
    }
  };

  const startEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || '',
      key: project.key,
      organizationId: project.organization.id,
      isPrivate: project.isPrivate
    });
  };

  const handleViewMembers = async (project: Project) => {
    setSelectedProject(project);
    setShowMembers(true);
    await fetchProjectMembers(project.id);
  };

  const handleAddMember = async (memberData: AddMemberRequest) => {
    if (!selectedProject) return;
    
    try {
      const response = await api.projects.addMember(selectedProject.id, memberData);
      if (response.data && response.data.status === 'success') {
        await fetchProjectMembers(selectedProject.id);
        // Update member count in the project
        setProjects(prev => prev.map(p => 
          p.id === selectedProject.id 
            ? { ...p, memberCount: (p.memberCount || 0) + 1 }
            : p
        ));
      } else {
        alert(response.data?.message || 'Failed to add member');
      }
    } catch (error: any) {
      console.error('Error adding member:', error);
      alert(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleUpdateMemberRole = async (userId: number, role: string) => {
    if (!selectedProject) return;
    
    try {
      const response = await api.projects.updateMemberRole(selectedProject.id, userId, { role });
      if (response.data && response.data.status === 'success') {
        await fetchProjectMembers(selectedProject.id);
      } else {
        alert(response.data?.message || 'Failed to update member role');
      }
    } catch (error: any) {
      console.error('Error updating member role:', error);
      alert(error.response?.data?.message || 'Failed to update member role');
    }
  };

  const handleRemoveMember = async (userId: number) => {
    if (!selectedProject) return;
    
    try {
      const response = await api.projects.removeMember(selectedProject.id, userId);
      if (response.data && response.data.status === 'success') {
        await fetchProjectMembers(selectedProject.id);
        // Update member count in the project
        setProjects(prev => prev.map(p => 
          p.id === selectedProject.id 
            ? { ...p, memberCount: Math.max(0, (p.memberCount || 1) - 1) }
            : p
        ));
      } else {
        alert(response.data?.message || 'Failed to remove member');
      }
    } catch (error: any) {
      console.error('Error removing member:', error);
      alert(error.response?.data?.message || 'Failed to remove member');
    }
  };

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.key.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterPrivacy === 'all' || 
                           (filterPrivacy === 'public' && !project.isPrivate) ||
                           (filterPrivacy === 'private' && project.isPrivate);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'issueCount':
          return (b.issueCount || 0) - (a.issueCount || 0);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p>Loading projects...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Error Display */}
      {error && (
        <div style={{
          backgroundColor: '#fadbd8',
          color: '#c0392b',
          padding: '1rem',
          borderRadius: '6px',
          marginBottom: '1rem',
          border: '1px solid #e74c3c'
        }}>
          <strong>Error:</strong> {error}
          <button 
            onClick={() => setError('')}
            style={{
              float: 'right',
              background: 'none',
              border: 'none',
              color: '#c0392b',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h1 style={{ 
              margin: '0 0 0.5rem 0', 
              color: '#2c3e50',
              fontSize: '2rem',
              fontWeight: '600'
            }}>
              Projects
            </h1>
            <p style={{ 
              margin: 0, 
              color: '#7f8c8d',
              fontSize: '1.1rem'
            }}>
              Manage your projects and track progress
            </p>
          </div>
          <button 
            onClick={() => setShowCreateForm(true)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2980b9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3498db'}
          >
            <span>➕</span>
            New Project
          </button>
        </div>

        {/* Filters and Search */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <input
              type="text"
              placeholder="Search projects by name, description, or key..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                border: '1px solid #bdc3c7',
                borderRadius: '6px',
                fontSize: '1rem'
              }}
            />
            <span style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#7f8c8d'
            }}>
              🔍
            </span>
          </div>

          {/* Filter */}
          <select
            value={filterPrivacy}
            onChange={(e) => setFilterPrivacy(e.target.value as any)}
            style={{
              padding: '0.75rem',
              border: '1px solid #bdc3c7',
              borderRadius: '6px',
              fontSize: '1rem',
              minWidth: '140px'
            }}
          >
            <option value="all">All Projects</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{
              padding: '0.75rem',
              border: '1px solid #bdc3c7',
              borderRadius: '6px',
              fontSize: '1rem',
              minWidth: '160px'
            }}
          >
            <option value="name">Sort by Name</option>
            <option value="createdAt">Sort by Created</option>
            <option value="issueCount">Sort by Issues</option>
          </select>

          {/* View Toggle */}
          <div style={{ display: 'flex', border: '1px solid #bdc3c7', borderRadius: '6px', overflow: 'hidden' }}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: viewMode === 'grid' ? '#3498db' : 'transparent',
                color: viewMode === 'grid' ? 'white' : '#2c3e50',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              ⏹️
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                padding: '0.5rem 0.75rem',
                backgroundColor: viewMode === 'list' ? '#3498db' : 'transparent',
                color: viewMode === 'list' ? 'white' : '#2c3e50',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              📋
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid/List */}
      {filteredProjects.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📁</div>
          <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>No projects found</h3>
          <p style={{ color: '#7f8c8d', marginBottom: '2rem' }}>
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first project'}
          </p>
          <button 
            onClick={() => setShowCreateForm(true)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            Create Project
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project}
              onEdit={startEdit}
              onDelete={(id) => setDeleteConfirm(id)}
              onViewMembers={handleViewMembers}
              onViewIssues={() => navigate(`/projects/${project.id}/issues`)}
            />
          ))}
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          {filteredProjects.map((project, index) => (
            <ProjectListItem 
              key={project.id} 
              project={project}
              onEdit={startEdit}
              onDelete={(id) => setDeleteConfirm(id)}
              onViewMembers={handleViewMembers}
              onViewIssues={() => navigate(`/projects/${project.id}/issues`)}
              isLast={index === filteredProjects.length - 1}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateForm || editingProject) && (
        <ProjectModal
          mode={editingProject ? 'edit' : 'create'}
          project={editingProject}
          formData={formData}
          onFormDataChange={setFormData}
          onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
          onClose={() => {
            setShowCreateForm(false);
            setEditingProject(null);
            setFormData({ name: '', description: '', key: '', organizationId: 1, isPrivate: false });
            setError('');
          }}
          error={error}
        />
      )}

      {/* Members Management Modal */}
      {showMembers && selectedProject && (
        <ProjectMembersModal
          project={selectedProject}
          members={members}
          loading={loadingMembers}
          onAddMember={handleAddMember}
          onUpdateMemberRole={handleUpdateMemberRole}
          onRemoveMember={handleRemoveMember}
          onClose={() => {
            setShowMembers(false);
            setSelectedProject(null);
            setMembers([]);
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <DeleteConfirmation
          project={projects.find(p => p.id === deleteConfirm)}
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
};

// Project Card Component
const ProjectCard: React.FC<{
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
  onViewMembers: (project: Project) => void;
  onViewIssues: () => void;
}> = ({ project, onEdit, onDelete, onViewMembers, onViewIssues }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div 
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        transition: 'all 0.2s',
        cursor: 'pointer',
        position: 'relative',
        border: project.isPrivate ? '2px solid #e74c3c' : '2px solid transparent'
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={onViewIssues}
    >
      {/* Project Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#3498db',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          color: 'white'
        }}>
          {project.key}
        </div>
        
        {/* Privacy Badge */}
        {project.isPrivate && (
          <span style={{
            padding: '0.25rem 0.5rem',
            backgroundColor: '#fadbd8',
            color: '#c0392b',
            borderRadius: '4px',
            fontSize: '0.7rem',
            fontWeight: '500'
          }}>
            🔒 Private
          </span>
        )}
        
        {/* Actions Menu */}
        {showActions && (
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            backgroundColor: 'white',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            overflow: 'hidden',
            zIndex: 10
          }}>
            <ActionButton icon="👥" label="Members" onClick={(e) => { e.stopPropagation(); onViewMembers(project); }} />
            <ActionButton icon="✏️" label="Edit" onClick={(e) => { e.stopPropagation(); onEdit(project); }} />
            <ActionButton icon="🗑️" label="Delete" onClick={(e) => { e.stopPropagation(); onDelete(project.id); }} color="#e74c3c" />
          </div>
        )}
      </div>

      {/* Project Content */}
      <h3 style={{ 
        margin: '0 0 0.5rem 0', 
        color: '#2c3e50',
        fontSize: '1.1rem',
        fontWeight: '600'
      }}>
        {project.name}
      </h3>
      
      <p style={{ 
        margin: '0 0 1rem 0', 
        color: '#7f8c8d',
        fontSize: '0.9rem',
        lineHeight: '1.4',
        minHeight: '40px'
      }}>
        {project.description || 'No description provided'}
      </p>

      {/* Organization */}
      <div style={{ marginBottom: '1rem', fontSize: '0.8rem', color: '#95a5a6' }}>
        Organization: {project.organization.name}
      </div>

      {/* Project Footer */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        paddingTop: '1rem',
        borderTop: '1px solid #ecf0f1'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '24px',
            height: '24px',
            backgroundColor: '#e74c3c',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.7rem',
            color: 'white',
            fontWeight: 'bold'
          }}>
            {project.owner.displayName?.charAt(0) || project.owner.username?.charAt(0) || 'U'}
          </div>
          <span style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>
            {project.owner.displayName || project.owner.username}
          </span>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#7f8c8d' }}>
          <span>🐛 {project.issueCount || 0}</span>
          <span>👥 {project.memberCount || 0}</span>
        </div>
      </div>

      {/* Created Date */}
      <div style={{ 
        marginTop: '0.5rem',
        fontSize: '0.7rem',
        color: '#bdc3c7',
        textAlign: 'right'
      }}>
        Created: {new Date(project.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

// Project List Item Component
const ProjectListItem: React.FC<{
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
  onViewMembers: (project: Project) => void;
  onViewIssues: () => void;
  isLast: boolean;
}> = ({ project, onEdit, onDelete, onViewMembers, onViewIssues, isLast }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div 
      style={{
        padding: '1.5rem',
        borderBottom: isLast ? 'none' : '1px solid #ecf0f1',
        transition: 'background-color 0.2s',
        cursor: 'pointer',
        position: 'relative'
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={onViewIssues}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Project Icon */}
        <div style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#3498db',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          color: 'white',
          flexShrink: 0
        }}>
          {project.key}
        </div>

        {/* Project Info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <h3 style={{ 
              margin: '0', 
              color: '#2c3e50',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              {project.name}
            </h3>
            {project.isPrivate && (
              <span style={{
                padding: '0.2rem 0.4rem',
                backgroundColor: '#fadbd8',
                color: '#c0392b',
                borderRadius: '4px',
                fontSize: '0.7rem',
                fontWeight: '500'
              }}>
                🔒 Private
              </span>
            )}
          </div>
          
          <p style={{ 
            margin: '0 0 0.5rem 0', 
            color: '#7f8c8d',
            fontSize: '0.9rem'
          }}>
            {project.description || 'No description provided'}
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: '#7f8c8d' }}>
            <span>Org: {project.organization.name}</span>
            <span>Owner: {project.owner.displayName || project.owner.username}</span>
            <span>🐛 {project.issueCount || 0} issues</span>
            <span>👥 {project.memberCount || 0} members</span>
            <span>📅 {new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <ActionButton icon="👥" onClick={(e) => { e.stopPropagation(); onViewMembers(project); }} />
            <ActionButton icon="✏️" onClick={(e) => { e.stopPropagation(); onEdit(project); }} />
            <ActionButton icon="🗑️" onClick={(e) => { e.stopPropagation(); onDelete(project.id); }} color="#e74c3c" />
          </div>
        )}
      </div>
    </div>
  );
};

// Project Modal Component
const ProjectModal: React.FC<{
  mode: 'create' | 'edit';
  project?: Project | null;
  formData: ProjectCreateRequest;
  onFormDataChange: (data: ProjectCreateRequest) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  error?: string;
}> = ({ mode, project, formData, onFormDataChange, onSubmit, onClose, error }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '1rem'
  }}>
    <form onSubmit={onSubmit} style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '8px',
      width: '100%',
      maxWidth: '500px',
      maxHeight: '90vh',
      overflow: 'auto'
    }}>
      <h2 style={{ margin: '0 0 1.5rem 0', color: '#2c3e50' }}>
        {mode === 'create' ? 'Create New Project' : 'Edit Project'}
      </h2>

      {error && (
        <div style={{
          backgroundColor: '#fadbd8',
          color: '#c0392b',
          padding: '0.75rem',
          borderRadius: '4px',
          marginBottom: '1rem',
          fontSize: '0.9rem'
        }}>
          {error}
        </div>
      )}
      
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem',
          fontWeight: '500',
          color: '#2c3e50'
        }}>
          Project Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
          required
          placeholder="Enter project name"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #bdc3c7',
            borderRadius: '6px',
            fontSize: '1rem'
          }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem',
          fontWeight: '500',
          color: '#2c3e50'
        }}>
          Project Key *
        </label>
        <input
          type="text"
          value={formData.key}
          onChange={(e) => onFormDataChange({ ...formData, key: e.target.value.toUpperCase() })}
          required
          placeholder="e.g., WEB, MOB, API"
          maxLength={10}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #bdc3c7',
            borderRadius: '6px',
            fontSize: '1rem',
            textTransform: 'uppercase'
          }}
        />
        <small style={{ color: '#7f8c8d', fontSize: '0.8rem' }}>
          Short unique identifier for the project (e.g., WEB for Website)
        </small>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem',
          fontWeight: '500',
          color: '#2c3e50'
        }}>
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
          placeholder="Describe the project..."
          rows={3}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #bdc3c7',
            borderRadius: '6px',
            fontSize: '1rem',
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
        />
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <label style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={formData.isPrivate}
            onChange={(e) => onFormDataChange({ ...formData, isPrivate: e.target.checked })}
            style={{ width: '18px', height: '18px' }}
          />
          <span style={{ fontWeight: '500', color: '#2c3e50' }}>
            Private Project
          </span>
        </label>
        <small style={{ color: '#7f8c8d', fontSize: '0.8rem', marginLeft: '1.5rem' }}>
          Private projects are only visible to project members
        </small>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button 
          type="button"
          onClick={onClose}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Cancel
        </button>
        <button 
          type="submit"
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          {mode === 'create' ? 'Create Project' : 'Save Changes'}
        </button>
      </div>
    </form>
  </div>
);

// Project Members Management Modal
const ProjectMembersModal: React.FC<{
  project: Project;
  members: ProjectMember[];
  loading: boolean;
  onAddMember: (memberData: AddMemberRequest) => void;
  onUpdateMemberRole: (userId: number, role: string) => void;
  onRemoveMember: (userId: number) => void;
  onClose: () => void;
}> = ({ project, members, loading, onAddMember, onUpdateMemberRole, onRemoveMember, onClose }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({ userId: '', role: 'MEMBER' as 'ADMIN' | 'MEMBER' | 'VIEWER' });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.userId) return;
    
    onAddMember({
      userId: parseInt(newMember.userId),
      role: newMember.role
    });
    setNewMember({ userId: '', role: 'MEMBER' });
    setShowAddForm(false);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, color: '#2c3e50' }}>
            {project.name} - Members ({members.length})
          </h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#7f8c8d'
            }}
          >
            ✕
          </button>
        </div>

        {/* Add Member Button */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            ➕ Add Member
          </button>
        </div>

        {/* Add Member Form */}
        {showAddForm && (
          <form onSubmit={handleAddMember} style={{
            backgroundColor: '#f8f9fa',
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                  User ID
                </label>
                <input
                  type="number"
                  value={newMember.userId}
                  onChange={(e) => setNewMember({ ...newMember, userId: e.target.value })}
                  placeholder="Enter user ID"
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #bdc3c7',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                  Role
                </label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value as any })}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #bdc3c7',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="VIEWER">Viewer</option>
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <button 
                type="submit"
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Add
              </button>
            </div>
          </form>
        )}

        {/* Members List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{
              width: '30px',
              height: '30px',
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #3498db',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto'
            }} />
            <p>Loading members...</p>
          </div>
        ) : members.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#7f8c8d' }}>
            No members found
          </div>
        ) : (
          <div style={{ border: '1px solid #ecf0f1', borderRadius: '6px', overflow: 'hidden' }}>
            {members.map((member, index) => (
              <div 
                key={member.id}
                style={{
                  padding: '1rem',
                  borderBottom: index === members.length - 1 ? 'none' : '1px solid #ecf0f1',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#3498db',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.8rem'
                  }}>
                    {member.user.displayName?.charAt(0) || member.user.username?.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: '500', color: '#2c3e50' }}>
                      {member.user.displayName || member.user.username}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>
                      {member.user.email} • {member.user.role}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <select
                    value={member.role}
                    onChange={(e) => onUpdateMemberRole(member.user.id, e.target.value)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      border: '1px solid #bdc3c7',
                      borderRadius: '4px',
                      fontSize: '0.8rem'
                    }}
                  >
                    <option value="VIEWER">Viewer</option>
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  
                  <button 
                    onClick={() => onRemoveMember(member.user.id)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Action Button Component
const ActionButton: React.FC<{
  icon: string;
  label?: string;
  onClick: (e: React.MouseEvent) => void;
  color?: string;
}> = ({ icon, label, onClick, color }) => (
  <button
    onClick={onClick}
    style={{
      padding: label ? '0.5rem 0.75rem' : '0.5rem',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      color: color || '#7f8c8d',
      transition: 'background-color 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      width: label ? 'auto' : 'fit-content'
    }}
    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
  >
    <span>{icon}</span>
    {label}
  </button>
);

// Delete Confirmation Component
const DeleteConfirmation: React.FC<{
  project?: Project;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ project, onConfirm, onCancel }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  }}>
    <div style={{
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '8px',
      width: '100%',
      maxWidth: '400px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
      <h3 style={{ margin: '0 0 1rem 0', color: '#2c3e50' }}>
        Delete Project
      </h3>
      <p style={{ color: '#7f8c8d', marginBottom: '2rem' }}>
        Are you sure you want to delete <strong>"{project?.name}"</strong>? This action cannot be undone.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button 
          onClick={onCancel}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Cancel
        </button>
        <button 
          onClick={onConfirm}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Delete Project
        </button>
      </div>
    </div>
  </div>
);

export default ProjectsPage;