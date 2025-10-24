// components/ProjectsPage.tsx
import React, { useState, useEffect } from 'react';
import { projectApi } from '../api/projectApi';
import type { Project, ProjectCreateRequest, ProjectUpdateRequest, ProjectMember, AddMemberRequest } from '../types/Project';

// CSS Styles
const styles = {
  // Layout
  container: {
    padding: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
    minHeight: '100vh',
    backgroundColor: '#f8fafc'
  } as React.CSSProperties,

  // Header
  header: {
    marginBottom: '2rem'
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  title: {
    margin: '0 0 0.5rem 0',
    color: '#1a202c',
    fontSize: '2.5rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  } as React.CSSProperties,
  subtitle: {
    margin: 0,
    color: '#718096',
    fontSize: '1.1rem',
    fontWeight: '400'
  },

  // Buttons
  primaryButton: {
    padding: '0.875rem 1.75rem',
    backgroundColor: '#4299e1',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(66, 153, 225, 0.3)'
  } as React.CSSProperties,
  secondaryButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#a0aec0',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  },
  dangerButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#e53e3e',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  },

  // Filters
  filtersContainer: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap' as 'wrap',
    padding: '1.5rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e2e8f0'
  },
  searchContainer: {
    position: 'relative' as 'relative',
    flex: 1,
    minWidth: '280px'
  },
  searchInput: {
    width: '100%',
    padding: '0.875rem 0.875rem 0.875rem 3rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    backgroundColor: '#f7fafc'
  } as React.CSSProperties,
  searchIcon: {
    position: 'absolute' as 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#a0aec0',
    fontSize: '1.1rem'
  },
  select: {
    padding: '0.875rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '160px'
  } as React.CSSProperties,
  viewToggle: {
    display: 'flex',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    overflow: 'hidden' as 'hidden'
  },
  viewButton: {
    padding: '0.75rem 1rem',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '1.1rem'
  } as React.CSSProperties,

  // Cards
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '1.75rem'
  } as React.CSSProperties,
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1.75rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    position: 'relative' as 'relative',
    border: '1px solid #e2e8f0',
    cursor: 'pointer'
  } as React.CSSProperties,
  cardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 25px rgba(0, 0, 0, 0.15)',
    borderColor: '#4299e1'
  } as React.CSSProperties,

  // List
  listContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden' as 'hidden',
    border: '1px solid #e2e8f0'
  },
  listItem: {
    padding: '1.75rem',
    borderBottom: '1px solid #e2e8f0',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  } as React.CSSProperties,
  listItemHover: {
    backgroundColor: '#f7fafc'
  },

  // Empty State
  emptyState: {
    textAlign: 'center' as 'center',
    padding: '5rem 2rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    border: '2px dashed #e2e8f0'
  },
  emptyIcon: {
    fontSize: '5rem',
    marginBottom: '1.5rem',
    opacity: 0.7
  },

  // Project Elements
  projectIcon: {
    width: '50px',
    height: '50px',
    backgroundColor: '#4299e1',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem', // Smaller font to fit better
    fontWeight: '700',
    color: 'white',
    boxShadow: '0 2px 8px rgba(66, 153, 225, 0.3)',
    flexShrink: 0
  } as React.CSSProperties,

  projectTitle: {
    margin: '0 0 0.75rem 0',
    color: '#2d3748',
    fontSize: '1.25rem',
    fontWeight: '600',
    lineHeight: '1.4'
  },
  projectDescription: {
    margin: '0 0 1.25rem 0',
    color: '#718096',
    fontSize: '0.95rem',
    lineHeight: '1.5',
    minHeight: '60px'
  },
  projectMeta: {
    fontSize: '0.85rem',
    color: '#a0aec0',
    marginBottom: '0.5rem'
  },
  projectFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1.25rem',
    borderTop: '1px solid #edf2f7'
  },
  userAvatar: {
    width: '28px',
    height: '28px',
    backgroundColor: '#e53e3e',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    color: 'white',
    fontWeight: 'bold'
  } as React.CSSProperties,
  stats: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.85rem',
    color: '#718096'
  },
  membersButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#48bb78',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease'
  } as React.CSSProperties,

  // Member Management Modal
  membersModal: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflow: 'auto',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
  } as React.CSSProperties,

  memberItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem',
    borderBottom: '1px solid #e2e8f0',
    transition: 'all 0.2s ease'
  } as React.CSSProperties,

  memberInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flex: 1
  },

  memberAvatar: {
    width: '40px',
    height: '40px',
    backgroundColor: '#4299e1',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    color: 'white',
    fontWeight: '600'
  } as React.CSSProperties,

  addMemberForm: {
    backgroundColor: '#f7fafc',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    border: '1px solid #e2e8f0'
  },

  // Actions
  actionsMenu: {
    position: 'absolute' as 'absolute',
    top: '1.25rem',
    right: '1.25rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    overflow: 'hidden' as 'hidden',
    zIndex: 10,
    border: '1px solid #e2e8f0'
  },
  actionButton: {
    padding: '0.75rem 1rem',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#718096',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease',
    width: '100%',
    minWidth: '120px'
  } as React.CSSProperties,

  // Modals
  modalOverlay: {
    position: 'fixed' as 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '1rem',
    backdropFilter: 'blur(4px)'
  } as React.CSSProperties,
  modal: {
    backgroundColor: 'white',
    padding: '2.5rem',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '520px',
    maxHeight: '90vh',
    overflow: 'auto' as 'auto',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
  } as React.CSSProperties,
  modalTitle: {
    margin: '0 0 2rem 0',
    color: '#2d3748',
    fontSize: '1.75rem',
    fontWeight: '600'
  },
  formGroup: {
    marginBottom: '1.5rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#4a5568',
    fontSize: '0.95rem'
  },
  input: {
    width: '100%',
    padding: '0.875rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    backgroundColor: '#f7fafc'
  } as React.CSSProperties,
  textarea: {
    width: '100%',
    padding: '0.875rem',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '1rem',
    resize: 'vertical' as 'vertical',
    transition: 'all 0.2s ease',
    backgroundColor: '#f7fafc',
    fontFamily: 'inherit',
    minHeight: '100px'
  } as React.CSSProperties,
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
    marginBottom: '0.5rem'
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  },
  modalActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '2rem'
  },

  // Loading
  loadingContainer: {
    padding: '4rem 2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh'
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #f3f4f6',
    borderTop: '4px solid #4299e1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  } as React.CSSProperties,

  // Badges
  privateBadge: {
    padding: '0.35rem 0.75rem',
    backgroundColor: '#fed7d7',
    color: '#c53030',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    border: '1px solid #feb2b2'
  } as React.CSSProperties,
  publicBadge: {
    padding: '0.35rem 0.75rem',
    backgroundColor: '#c6f6d5',
    color: '#276749',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    border: '1px solid #9ae6b4'
  } as React.CSSProperties
};

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'archived'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'created'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Member Management State
  const [showMembers, setShowMembers] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [newMember, setNewMember] = useState({ userId: '', role: 'MEMBER' as 'ADMIN' | 'MEMBER' | 'VIEWER' });

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
      const response = await projectApi.getAll();
      setProjects(response.data.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Member Management Functions
  const fetchProjectMembers = async (projectId: number) => {
    setLoadingMembers(true);
    try {
      const response = await projectApi.getMembers(projectId);
      setMembers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching project members:', error);
      alert('Failed to load project members');
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleViewMembers = async (project: Project) => {
    setSelectedProject(project);
    setShowMembers(true);
    await fetchProjectMembers(project.id);
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !newMember.userId) return;

    try {
      const memberData: AddMemberRequest = {
        userId: parseInt(newMember.userId),
        role: newMember.role
      };
      
      await projectApi.addMember(selectedProject.id, memberData);
      setNewMember({ userId: '', role: 'MEMBER' });
      setShowAddMemberForm(false);
      await fetchProjectMembers(selectedProject.id); // Refresh members list
      fetchProjects(); // Refresh projects to update member count
    } catch (error: any) {
      console.error('Error adding member:', error);
      alert(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleUpdateMemberRole = async (userId: number, role: string) => {
    if (!selectedProject) return;

    try {
      await projectApi.updateMemberRole(selectedProject.id, userId, { role });
      await fetchProjectMembers(selectedProject.id); // Refresh members list
    } catch (error: any) {
      console.error('Error updating member role:', error);
      alert(error.response?.data?.message || 'Failed to update member role');
    }
  };

  const handleRemoveMember = async (userId: number) => {
    if (!selectedProject) return;

    if (!confirm('Are you sure you want to remove this member from the project?')) {
      return;
    }

    try {
      await projectApi.removeMember(selectedProject.id, userId);
      await fetchProjectMembers(selectedProject.id); // Refresh members list
      fetchProjects(); // Refresh projects to update member count
    } catch (error: any) {
      console.error('Error removing member:', error);
      alert(error.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const projectData = {
        ...formData,
        key: formData.key || formData.name.substring(0, 3).toUpperCase()
      };
      
      await projectApi.create(projectData);
      setShowCreateForm(false);
      setFormData({ name: '', description: '', key: '', organizationId: 1, isPrivate: false });
      fetchProjects();
    } catch (error: any) {
      console.error('Error creating project:', error);
      alert(error.response?.data?.message || 'Failed to create project');
    }
  };

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const updateData: ProjectUpdateRequest = {
        name: formData.name,
        description: formData.description,
        key: formData.key,
        isPrivate: formData.isPrivate
      };
      
      await projectApi.update(editingProject.id, updateData);
      setEditingProject(null);
      setFormData({ name: '', description: '', key: '', organizationId: 1, isPrivate: false });
      fetchProjects();
    } catch (error: any) {
      console.error('Error updating project:', error);
      alert(error.response?.data?.message || 'Failed to update project');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await projectApi.delete(id);
      setDeleteConfirm(null);
      fetchProjects();
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

  // Filter and sort projects
  const filteredProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.key.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={{ textAlign: 'center' }}>
          <div style={styles.spinner} />
          <p style={{ marginTop: '1rem', color: '#718096' }}>Loading projects...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.title}>Projects</h1>
            <p style={styles.subtitle}>Manage your projects and track progress</p>
          </div>
          <button 
            onClick={() => setShowCreateForm(true)}
            style={styles.primaryButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#3182ce';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(66, 153, 225, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4299e1';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(66, 153, 225, 0.3)';
            }}
          >
            <span>🚀</span>
            New Project
          </button>
        </div>

        {/* Filters and Search */}
        <div style={styles.filtersContainer}>
          {/* Search */}
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search projects by name, description, or key..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
              onFocus={(e) => e.target.style.borderColor = '#4299e1'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
            <span style={styles.searchIcon}>🔍</span>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={styles.select}
            onFocus={(e) => e.target.style.borderColor = '#4299e1'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          >
            <option value="name">Sort by Name</option>
            <option value="created">Sort by Created</option>
          </select>

          {/* View Toggle */}
          <div style={styles.viewToggle}>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                ...styles.viewButton,
                backgroundColor: viewMode === 'grid' ? '#4299e1' : 'transparent',
                color: viewMode === 'grid' ? 'white' : '#4a5568'
              }}
            >
              ⏹️
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                ...styles.viewButton,
                backgroundColor: viewMode === 'list' ? '#4299e1' : 'transparent',
                color: viewMode === 'list' ? 'white' : '#4a5568'
              }}
            >
              📋
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid/List */}
      {filteredProjects.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📁</div>
          <h3 style={{ color: '#2d3748', marginBottom: '0.5rem' }}>No projects found</h3>
          <p style={{ color: '#718096', marginBottom: '2rem' }}>
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first project'}
          </p>
          <button 
            onClick={() => setShowCreateForm(true)}
            style={styles.primaryButton}
          >
            Create Project
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div style={styles.gridContainer}>
          {filteredProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project}
              onEdit={startEdit}
              onDelete={(id) => setDeleteConfirm(id)}
              onViewMembers={handleViewMembers}
            />
          ))}
        </div>
      ) : (
        <div style={styles.listContainer}>
          {filteredProjects.map((project, index) => (
            <ProjectListItem 
              key={project.id} 
              project={project}
              onEdit={startEdit}
              onDelete={(id) => setDeleteConfirm(id)}
              onViewMembers={handleViewMembers}
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
          }}
        />
      )}

      {/* Members Management Modal */}
      {showMembers && selectedProject && (
        <MembersManagementModal
          project={selectedProject}
          members={members}
          loading={loadingMembers}
          showAddMemberForm={showAddMemberForm}
          newMember={newMember}
          onNewMemberChange={setNewMember}
          onShowAddMemberFormChange={setShowAddMemberForm}
          onAddMember={handleAddMember}
          onUpdateMemberRole={handleUpdateMemberRole}
          onRemoveMember={handleRemoveMember}
          onClose={() => {
            setShowMembers(false);
            setSelectedProject(null);
            setMembers([]);
            setShowAddMemberForm(false);
            setNewMember({ userId: '', role: 'MEMBER' });
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

// Project Card Component (Grid View)
const ProjectCard: React.FC<{
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
  onViewMembers: (project: Project) => void;
}> = ({ project, onEdit, onDelete, onViewMembers }) => {
  const [showActions, setShowActions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      style={{
        ...styles.card,
        ...(isHovered ? styles.cardHover : {})
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        setShowActions(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowActions(false);
      }}
    >
      {/* Project Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div style={styles.projectIcon}>
          {project.key}
        </div>
        
        {/* Privacy Badge */}
        <div style={project.isPrivate ? styles.privateBadge : styles.publicBadge}>
          {project.isPrivate ? '🔒 Private' : '🌐 Public'}
        </div>
        
        {/* Actions Menu */}
        {showActions && (
          <div style={styles.actionsMenu}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewMembers(project);
              }}
              style={styles.actionButton}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f7fafc'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span>👥</span>
              Members
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
              style={styles.actionButton}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f7fafc'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span>✏️</span>
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
              }}
              style={{
                ...styles.actionButton,
                color: '#e53e3e'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fed7d7'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span>🗑️</span>
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Project Content */}
      <h3 style={styles.projectTitle}>
        {project.name}
      </h3>
      
      <p style={styles.projectDescription}>
        {project.description || 'No description provided'}
      </p>

      {/* Project Meta */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={styles.projectMeta}>
          Organization: {project.organization.name}
        </div>
        <div style={styles.projectMeta}>
          Created: {new Date(project.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Project Footer */}
      <div style={styles.projectFooter}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={styles.userAvatar}>
            {project.owner?.displayName?.charAt(0) || project.owner?.username?.charAt(0) || 'U'}
          </div>
          <span style={{ fontSize: '0.9rem', color: '#718096', fontWeight: '500' }}>
            {project.owner?.displayName || project.owner?.username || 'Unknown'}
          </span>
        </div>

        {/* Quick Stats */}
        <div style={styles.stats}>
          <span title="Issues">🐛 {project.issueCount || 0}</span>
          <span title="Members">👥 {project.memberCount || 0}</span>
        </div>
      </div>

      {/* View Members Button (always visible) */}
      <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={() => onViewMembers(project)}
          style={styles.membersButton}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#38a169'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#48bb78'}
        >
          <span>👥</span>
          Manage Members ({project.memberCount || 0})
        </button>
      </div>
    </div>
  );
};

// Project List Item Component (List View)
const ProjectListItem: React.FC<{
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
  onViewMembers: (project: Project) => void;
  isLast: boolean;
}> = ({ project, onEdit, onDelete, onViewMembers, isLast }) => {
  const [showActions, setShowActions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      style={{
        ...styles.listItem,
        ...(isHovered ? styles.listItemHover : {}),
        borderBottom: isLast ? 'none' : '1px solid #e2e8f0'
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        setShowActions(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowActions(false);
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Project Icon */}
        <div style={styles.projectIcon}>
          {project.key}
        </div>

        {/* Project Info */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <h3 style={styles.projectTitle}>
              {project.name}
            </h3>
            <div style={project.isPrivate ? styles.privateBadge : styles.publicBadge}>
              {project.isPrivate ? 'Private' : 'Public'}
            </div>
          </div>
          
          <p style={styles.projectDescription}>
            {project.description || 'No description provided'}
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.9rem', color: '#718096' }}>
            <span>🏢 {project.organization.name}</span>
            <span>👤 {project.owner.displayName}</span>
            <span>🐛 {project.issueCount} issues</span>
            <span>👥 {project.memberCount} members</span>
            <span>📅 {new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewMembers(project);
              }}
              style={styles.actionButton}
              title="Manage Members"
            >
              👥
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
              style={styles.actionButton}
              title="Edit Project"
            >
              ✏️
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
              }}
              style={{
                ...styles.actionButton,
                color: '#e53e3e'
              }}
              title="Delete Project"
            >
              🗑️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const MembersManagementModal: React.FC<{
  project: Project;
  members: ProjectMember[];
  loading: boolean;
  showAddMemberForm: boolean;
  newMember: { userId: string; role: 'ADMIN' | 'MEMBER' | 'VIEWER' };
  onNewMemberChange: (member: { userId: string; role: 'ADMIN' | 'MEMBER' | 'VIEWER' }) => void;
  onShowAddMemberFormChange: (show: boolean) => void;
  onAddMember: (e: React.FormEvent) => void;
  onUpdateMemberRole: (userId: number, role: string) => void;
  onRemoveMember: (userId: number) => void;
  onClose: () => void;
}> = ({ 
  project, 
  members, 
  loading, 
  showAddMemberForm, 
  newMember, 
  onNewMemberChange, 
  onShowAddMemberFormChange, 
  onAddMember, 
  onUpdateMemberRole, 
  onRemoveMember, 
  onClose 
}) => (
  <div style={styles.modalOverlay} onClick={onClose}>
    <div style={styles.membersModal} onClick={(e) => e.stopPropagation()}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={styles.modalTitle}>
            {project.name} - Team Members
          </h2>
          <p style={{ color: '#718096', margin: 0 }}>
            Manage project members and their roles
          </p>
        </div>
        <button 
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#a0aec0',
            padding: '0.5rem'
          }}
        >
          ✕
        </button>
      </div>

      {/* Add Member Section */}
      <div style={styles.addMemberForm}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, color: '#2d3748', fontSize: '1.2rem' }}>Add Team Member</h3>
          <button
            onClick={() => onShowAddMemberFormChange(!showAddMemberForm)}
            style={{
              ...styles.primaryButton,
              padding: '0.5rem 1rem',
              fontSize: '0.9rem'
            }}
          >
            {showAddMemberForm ? 'Cancel' : '+ Add Member'}
          </button>
        </div>

        {showAddMemberForm && (
          <form onSubmit={onAddMember}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
              <div>
                <label style={styles.label}>User ID</label>
                <input
                  type="number"
                  value={newMember.userId}
                  onChange={(e) => onNewMemberChange({ ...newMember, userId: e.target.value })}
                  placeholder="Enter user ID"
                  required
                  style={styles.input}
                />
              </div>
              <div>
                <label style={styles.label}>Role</label>
                <select
                  value={newMember.role}
                  onChange={(e) => onNewMemberChange({ ...newMember, role: e.target.value as any })}
                  style={styles.select}
                >
                  <option value="VIEWER">Viewer</option>
                  <option value="MEMBER">Member</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <button 
                type="submit"
                style={{
                  ...styles.primaryButton,
                  padding: '0.875rem 1.5rem'
                }}
              >
                Add
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Members List */}
      <div>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '1.2rem' }}>
          Current Members ({members.length})
        </h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={styles.spinner} />
            <p style={{ marginTop: '1rem', color: '#718096' }}>Loading members...</p>
          </div>
        ) : members.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#a0aec0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
            <p>No members found. Add your first team member!</p>
          </div>
        ) : (
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            {members.map((member, index) => (
              <div key={member.id} style={styles.memberItem}>
                <div style={styles.memberInfo}>
                  <div style={styles.memberAvatar}>
                    {member.user.displayName?.charAt(0) || member.user.username?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#2d3748' }}>
                      {member.user.displayName || member.user.username}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#718096' }}>
                      {member.user.email} • {member.user.role}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#a0aec0' }}>
                      Joined: {new Date(member.assignedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <select
                    value={member.role}
                    onChange={(e) => onUpdateMemberRole(member.user.id, e.target.value)}
                    style={{
                      ...styles.select,
                      padding: '0.5rem',
                      fontSize: '0.9rem'
                    }}
                  >
                    <option value="VIEWER">Viewer</option>
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  
                  <button
                    onClick={() => onRemoveMember(member.user.id)}
                    style={{
                      ...styles.dangerButton,
                      padding: '0.5rem 1rem',
                      fontSize: '0.9rem'
                    }}
                    title="Remove member"
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
  </div>
);

// Project Modal Component
const ProjectModal: React.FC<{
  mode: 'create' | 'edit';
  project?: Project | null;
  formData: ProjectCreateRequest;
  onFormDataChange: (data: ProjectCreateRequest) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}> = ({ mode, project, formData, onFormDataChange, onSubmit, onClose }) => (
  <div style={styles.modalOverlay} onClick={onClose}>
    <form onSubmit={onSubmit} style={styles.modal} onClick={(e) => e.stopPropagation()}>
      <h2 style={styles.modalTitle}>
        {mode === 'create' ? 'Create New Project' : 'Edit Project'}
      </h2>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          Project Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onFormDataChange({ ...formData, name: e.target.value })}
          required
          placeholder="Enter project name"
          style={styles.input}
          onFocus={(e) => e.target.style.borderColor = '#4299e1'}
          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          Project Key *
        </label>
        <input
          type="text"
          value={formData.key}
          onChange={(e) => onFormDataChange({ ...formData, key: e.target.value.toUpperCase() })}
          required
          placeholder="e.g., WEB, MOB"
          maxLength={10}
          style={styles.input}
          onFocus={(e) => e.target.style.borderColor = '#4299e1'}
          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
        />
        <small style={{ color: '#a0aec0', fontSize: '0.85rem' }}>
          Short unique identifier for the project (e.g., WEB for Website)
        </small>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
          placeholder="Describe the project..."
          rows={4}
          style={styles.textarea}
          onFocus={(e) => e.target.style.borderColor = '#4299e1'}
          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.checkboxContainer}>
          <input
            type="checkbox"
            checked={formData.isPrivate}
            onChange={(e) => onFormDataChange({ ...formData, isPrivate: e.target.checked })}
            style={styles.checkbox}
          />
          <span style={{ fontWeight: '600', color: '#4a5568' }}>
            Private Project
          </span>
        </label>
        <small style={{ color: '#a0aec0', fontSize: '0.85rem', marginLeft: '2rem' }}>
          Only organization members can view private projects
        </small>
      </div>

      <div style={styles.modalActions}>
        <button 
          type="button"
          onClick={onClose}
          style={styles.secondaryButton}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#718096'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#a0aec0'}
        >
          Cancel
        </button>
        <button 
          type="submit"
          style={styles.primaryButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#3182ce';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#4299e1';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {mode === 'create' ? 'Create Project' : 'Save Changes'}
        </button>
      </div>
    </form>
  </div>
);

// Delete Confirmation Component (same as before)
const DeleteConfirmation: React.FC<{
  project?: Project;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ project, onConfirm, onCancel }) => (
  <div style={styles.modalOverlay} onClick={onCancel}>
    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.8 }}>⚠️</div>
        <h3 style={{ ...styles.modalTitle, marginBottom: '1rem' }}>
          Delete Project
        </h3>
        <p style={{ color: '#718096', marginBottom: '2.5rem', lineHeight: '1.6' }}>
          Are you sure you want to delete <strong style={{ color: '#2d3748' }}>"{project?.name}"</strong>? 
          This action cannot be undone and all project data will be permanently lost.
        </p>
        <div style={styles.modalActions}>
          <button 
            onClick={onCancel}
            style={styles.secondaryButton}
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            style={styles.dangerButton}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c53030'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e53e3e'}
          >
            Delete Project
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ProjectsPage;