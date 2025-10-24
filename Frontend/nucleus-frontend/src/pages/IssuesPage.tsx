import React, { useState, useEffect } from 'react';
import { api } from '../api/axiosClient';
import type { 
  Issue, 
  IssueCreateRequest, 
  IssueUpdateRequest, 
  IssueStatus, 
  Priority,
  IssueType 
} from '../types/Issue';
import CommentsSection from '../components/CommentsSection';

// CSS Styles as constants
const styles = {
  // Layout
  container: {
    padding: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  } as React.CSSProperties,

  // Header
  header: {
    marginBottom: '2rem'
  } as React.CSSProperties,

  headerTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem'
  } as React.CSSProperties,

  headerTitle: {
    margin: '0 0 0.5rem 0',
    color: '#2c3e50',
    fontSize: '2rem',
    fontWeight: 600
  } as React.CSSProperties,

  headerSubtitle: {
    margin: 0,
    color: '#7f8c8d',
    fontSize: '1.1rem'
  } as React.CSSProperties,

  // Buttons
  btnPrimary: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'background-color 0.2s'
  } as React.CSSProperties,

  btnSecondary: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 500
  } as React.CSSProperties,

  btnDanger: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 500
  } as React.CSSProperties,

  // Filters
  filtersContainer: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: '1rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  } as React.CSSProperties,

  searchBox: {
    position: 'relative',
    flex: 1,
    minWidth: '250px'
  } as React.CSSProperties,

  searchInput: {
    width: '100%',
    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
    border: '1px solid #bdc3c7',
    borderRadius: '6px',
    fontSize: '1rem'
  } as React.CSSProperties,

  searchIcon: {
    position: 'absolute',
    left: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#7f8c8d'
  } as React.CSSProperties,

  filterSelect: {
    padding: '0.75rem',
    border: '1px solid #bdc3c7',
    borderRadius: '6px',
    fontSize: '1rem',
    minWidth: '140px'
  } as React.CSSProperties,

  viewToggle: {
    display: 'flex',
    border: '1px solid #bdc3c7',
    borderRadius: '6px',
    overflow: 'hidden'
  } as React.CSSProperties,

  viewToggleBtn: {
    padding: '0.5rem 0.75rem',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s'
  } as React.CSSProperties,

  // Loading
  loadingContainer: {
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
    textAlign: 'center'
  } as React.CSSProperties,

  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1rem'
  } as React.CSSProperties,

  // Empty State
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  } as React.CSSProperties,

  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem'
  } as React.CSSProperties,

  emptyTitle: {
    color: '#2c3e50',
    marginBottom: '0.5rem'
  } as React.CSSProperties,

  emptyText: {
    color: '#7f8c8d',
    marginBottom: '2rem'
  } as React.CSSProperties,

  // Issues List
  issuesList: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  } as React.CSSProperties,

  issueListItem: {
    padding: '1.5rem',
    borderBottom: '1px solid #ecf0f1',
    transition: 'background-color 0.2s',
    position: 'relative',
    cursor: 'pointer'
  } as React.CSSProperties,

  issueListItemLast: {
    borderBottom: 'none'
  } as React.CSSProperties,

  issueContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem'
  } as React.CSSProperties,

  priorityIcon: {
    fontSize: '1.2rem',
    marginTop: '0.25rem'
  } as React.CSSProperties,

  issueDetails: {
    flex: 1
  } as React.CSSProperties,

  issueHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem'
  } as React.CSSProperties,

  issueTitle: {
    margin: '0 0 0.25rem 0',
    color: '#2c3e50',
    fontSize: '1.1rem',
    fontWeight: 600
  } as React.CSSProperties,

  issueMeta: {
    fontSize: '0.8rem',
    color: '#7f8c8d',
    marginBottom: '0.5rem'
  } as React.CSSProperties,

  issueActions: {
    display: 'flex',
    gap: '0.5rem'
  } as React.CSSProperties,

  issueDescription: {
    margin: '0 0 1rem 0',
    color: '#7f8c8d',
    fontSize: '0.9rem'
  } as React.CSSProperties,

  issueFooter: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap'
  } as React.CSSProperties,

  statusDropdown: (color: string) => ({
    padding: '0.25rem 0.5rem',
    border: `1px solid ${color}`,
    borderRadius: '4px',
    backgroundColor: color,
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: 500,
    cursor: 'pointer'
  } as React.CSSProperties),

  priorityBadge: (color: string) => ({
    color: 'white',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: 500,
    backgroundColor: color
  } as React.CSSProperties),

  projectInfo: {
    fontSize: '0.8rem',
    color: '#7f8c8d'
  } as React.CSSProperties,

  // Board View
  boardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    alignItems: 'flex-start'
  } as React.CSSProperties,

  boardColumn: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    minHeight: '400px'
  } as React.CSSProperties,

  columnHeader: (color: string) => ({
    padding: '1rem',
    backgroundColor: color,
    color: 'white',
    fontWeight: 600,
    borderRadius: '8px 8px 0 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  } as React.CSSProperties),

  columnCount: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.8rem'
  } as React.CSSProperties,

  columnContent: {
    padding: '1rem'
  } as React.CSSProperties,

  emptyColumn: {
    textAlign: 'center',
    padding: '2rem',
    color: '#7f8c8d',
    fontSize: '0.9rem'
  } as React.CSSProperties,

  // Issue Card
  issueCard: {
    backgroundColor: 'white',
    border: '1px solid #ecf0f1',
    borderRadius: '6px',
    padding: '1rem',
    marginBottom: '0.75rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'all 0.2s',
    cursor: 'pointer',
    position: 'relative'
  } as React.CSSProperties,

  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem'
  } as React.CSSProperties,

  cardPriority: {
    fontSize: '1rem'
  } as React.CSSProperties,

  cardActions: {
    display: 'flex',
    gap: '0.25rem'
  } as React.CSSProperties,

  cardTitle: {
    margin: '0 0 0.5rem 0',
    color: '#2c3e50',
    fontSize: '0.9rem',
    fontWeight: 600,
    lineHeight: '1.3'
  } as React.CSSProperties,

  cardDescription: {
    margin: '0 0 0.75rem 0',
    color: '#7f8c8d',
    fontSize: '0.8rem',
    lineHeight: '1.2'
  } as React.CSSProperties,

  cardStatusDropdown: (color: string) => ({
    width: '100%',
    padding: '0.25rem',
    border: `1px solid ${color}`,
    borderRadius: '3px',
    backgroundColor: color,
    color: 'white',
    fontSize: '0.7rem',
    fontWeight: 500,
    cursor: 'pointer'
  } as React.CSSProperties),

  // Action Button
  actionBtn: {
    padding: '0.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    borderRadius: '4px',
    transition: 'background-color 0.2s'
  } as React.CSSProperties,

  actionBtnSmall: {
    padding: '0.25rem',
    fontSize: '0.8rem'
  } as React.CSSProperties,

  // Modal
  modalOverlay: {
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
  } as React.CSSProperties,

  modalContent: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto'
  } as React.CSSProperties,

  modalTitle: {
    margin: '0 0 1.5rem 0',
    color: '#2c3e50'
  } as React.CSSProperties,

  formGroup: {
    marginBottom: '1.5rem'
  } as React.CSSProperties,

  formLabel: {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 500,
    color: '#2c3e50'
  } as React.CSSProperties,

  formInput: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #bdc3c7',
    borderRadius: '6px',
    fontSize: '1rem'
  } as React.CSSProperties,

  formTextarea: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #bdc3c7',
    borderRadius: '6px',
    fontSize: '1rem',
    resize: 'vertical'
  } as React.CSSProperties,

  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1.5rem'
  } as React.CSSProperties,

  modalActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end'
  } as React.CSSProperties,

  // Confirmation Modal
  confirmationModal: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center'
  } as React.CSSProperties,

  confirmationIcon: {
    fontSize: '3rem',
    marginBottom: '1rem'
  } as React.CSSProperties,

  confirmationTitle: {
    margin: '0 0 1rem 0',
    color: '#2c3e50'
  } as React.CSSProperties,

  confirmationText: {
    color: '#7f8c8d',
    marginBottom: '2rem'
  } as React.CSSProperties,

  confirmationActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center'
  } as React.CSSProperties,

  // Issue Detail Modal
  issueDetailModal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    width: '100%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflow: 'auto'
  } as React.CSSProperties,

  detailHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid #ecf0f1',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  } as React.CSSProperties,

  detailTitle: {
    flex: 1
  } as React.CSSProperties,

  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem'
  } as React.CSSProperties,

  detailTitleText: {
    margin: 0,
    color: '#2c3e50'
  } as React.CSSProperties,

  statusBadges: {
    display: 'flex',
    gap: '0.5rem'
  } as React.CSSProperties,

  statusBadge: (color: string) => ({
    color: 'white',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: 500,
    backgroundColor: color
  } as React.CSSProperties),

  detailMeta: {
    display: 'flex',
    gap: '2rem',
    fontSize: '0.9rem',
    color: '#7f8c8d'
  } as React.CSSProperties,

  closeBtn: {
    padding: '0.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
    color: '#7f8c8d'
  } as React.CSSProperties,

  detailSection: {
    padding: '1.5rem',
    borderBottom: '1px solid #ecf0f1'
  } as React.CSSProperties,

  detailSectionTitle: {
    margin: '0 0 1rem 0',
    color: '#2c3e50'
  } as React.CSSProperties,

  descriptionContent: {
    color: '#2c3e50',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap'
  } as React.CSSProperties,

  // Hover effects
  hoverEffect: {
    ':hover': {
      backgroundColor: '#f8f9fa'
    }
  } as React.CSSProperties
};

const IssuesPage: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'ALL'>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  // Get current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserId = currentUser.id || 1;

  const [formData, setFormData] = useState<IssueCreateRequest>({
    title: '',
    description: '',
    type: 'TASK',
    status: 'OPEN',
    priority: 'MEDIUM',
    projectId: 1,
    reporterId: currentUserId
  });

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      console.log('🔄 Fetching issues...');
      const response = await api.issues.getAll();
      console.log('📦 Issues API response:', response);
      
      if (response.data.status === 'success' && response.data.data) {
        setIssues(response.data.data);
      } else {
        console.error('Failed to fetch issues:', response.data.message);
        setIssues([]);
      }
    } catch (error: any) {
      console.error('Error fetching issues:', error);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
  };

  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Issue title is required');
      return;
    }

    console.log('🔄 Creating issue with data:', formData);

    try {
      const response = await api.issues.create(formData);
      console.log('📦 Create issue response:', response);
      
      if (response.data.status === 'success') {
        setShowCreateForm(false);
        setFormData({
          title: '',
          description: '',
          type: 'TASK',
          status: 'OPEN',
          priority: 'MEDIUM',
          projectId: 1,
          reporterId: currentUserId
        });
        await fetchIssues();
        alert('Issue created successfully!');
      } else {
        alert(`Failed to create issue: ${response.data.message}`);
      }
    } catch (error: any) {
      console.error('Error creating issue:', error);
      alert(`Error: ${error.response?.data?.message || 'Failed to create issue'}`);
    }
  };

  const handleUpdateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIssue) return;

    if (!formData.title.trim()) {
      alert('Issue title is required');
      return;
    }

    console.log('🔄 Updating issue:', editingIssue.id, 'with data:', formData);

    try {
      const updateData: IssueUpdateRequest = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        status: formData.status,
        priority: formData.priority
      };
      
      const response = await api.issues.update(editingIssue.id, updateData);
      console.log('📦 Update issue response:', response);
      
      if (response.data.status === 'success') {
        setEditingIssue(null);
        setFormData({
          title: '',
          description: '',
          type: 'TASK',
          status: 'OPEN',
          priority: 'MEDIUM',
          projectId: 1,
          reporterId: currentUserId
        });
        await fetchIssues();
        alert('Issue updated successfully!');
      } else {
        alert(`Failed to update issue: ${response.data.message}`);
      }
    } catch (error: any) {
      console.error('Error updating issue:', error);
      alert(`Error: ${error.response?.data?.message || 'Failed to update issue'}`);
    }
  };

  const handleDelete = async (id: number) => {
    console.log('🔄 Deleting issue:', id);

    try {
      const response = await api.issues.delete(id);
      console.log('📦 Delete issue response:', response);
      
      if (response.data.status === 'success') {
        setDeleteConfirm(null);
        await fetchIssues();
        alert('Issue deleted successfully!');
      } else {
        alert(`Failed to delete issue: ${response.data.message}`);
      }
    } catch (error: any) {
      console.error('Error deleting issue:', error);
      alert(`Error: ${error.response?.data?.message || 'Failed to delete issue'}`);
    }
  };

  const startEdit = (issue: Issue) => {
    console.log('✏️ Editing issue:', issue);
    setEditingIssue(issue);
    setFormData({
      title: issue.title,
      description: issue.description || '',
      type: issue.type,
      status: issue.status,
      priority: issue.priority,
      projectId: issue.project?.id || 1,
      reporterId: currentUserId
    });
  };

  const handleStatusChange = async (issueId: number, newStatus: IssueStatus) => {
    try {
      // Get the current issue to preserve all fields
      const currentIssue = issues.find(issue => issue.id === issueId);
      if (!currentIssue) {
        alert('Issue not found');
        return;
      }
  
      // Create update data with all required fields
      const updateData: IssueUpdateRequest = {
        title: currentIssue.title, // Preserve the title
        description: currentIssue.description,
        type: currentIssue.type,
        status: newStatus,
        priority: currentIssue.priority
      };
      
      const response = await api.issues.update(issueId, updateData);
      if (response.data.status === 'success') {
        await fetchIssues();
      } else {
        alert(`Failed to update status: ${response.data.message}`);
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      alert(`Error: ${error.response?.data?.message || 'Failed to update status'}`);
    }
  };

  // Filter issues
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || issue.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || issue.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Group issues by status for board view
  const issuesByStatus = {
    OPEN: filteredIssues.filter(issue => issue.status === 'OPEN'),
    IN_PROGRESS: filteredIssues.filter(issue => issue.status === 'IN_PROGRESS'),
    CLOSED: filteredIssues.filter(issue => issue.status === 'CLOSED'),
    CODE_REVIEW: filteredIssues.filter(issue => issue.status === 'CODE_REVIEW'),
    TESTING: filteredIssues.filter(issue => issue.status === 'TESTING'),
    DONE: filteredIssues.filter(issue => issue.status === 'DONE')
  };

  const getStatusColor = (status: IssueStatus) => {
    switch (status) {
      case 'OPEN': return '#e74c3c';
      case 'IN_PROGRESS': return '#3498db';
      case 'CODE_REVIEW': return '#9b59b6';
      case 'TESTING': return '#f39c12';
      case 'DONE': return '#27ae60';
      case 'CLOSED': return '#95a5a6';
      default: return '#95a5a6';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'LOWEST': return '#27ae60';
      case 'LOW': return '#2ecc71';
      case 'MEDIUM': return '#f39c12';
      case 'HIGH': return '#e74c3c';
      case 'HIGHEST': return '#c0392b';
      case 'CRITICAL': return '#8e44ad';
      default: return '#95a5a6';
    }
  };

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case 'LOWEST': return '🟢';
      case 'LOW': return '🔵';
      case 'MEDIUM': return '🟡';
      case 'HIGH': return '🟠';
      case 'HIGHEST': return '🔴';
      case 'CRITICAL': return '💜';
      default: return '⚪';
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading issues...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div>
            <h1 style={styles.headerTitle}>Issues ({filteredIssues.length})</h1>
            <p style={styles.headerSubtitle}>Track and manage project issues</p>
          </div>
          <button 
            onClick={() => setShowCreateForm(true)}
            style={styles.btnPrimary}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2980b9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3498db'}
          >
            <span>➕</span>
            New Issue
          </button>
        </div>

        {/* Filters and Controls */}
        <div style={styles.filtersContainer}>
          {/* Search */}
          <div style={styles.searchBox}>
            <input
              type="text"
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
            <span style={styles.searchIcon}>🔍</span>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as IssueStatus | 'ALL')}
            style={styles.filterSelect}
          >
            <option value="ALL">All Status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CODE_REVIEW">Code Review</option>
            <option value="TESTING">Testing</option>
            <option value="DONE">Done</option>
            <option value="CLOSED">Closed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as Priority | 'ALL')}
            style={styles.filterSelect}
          >
            <option value="ALL">All Priority</option>
            <option value="LOWEST">Lowest</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="HIGHEST">Highest</option>
            <option value="CRITICAL">Critical</option>
          </select>

          {/* View Toggle */}
          <div style={styles.viewToggle}>
            <button
              onClick={() => setViewMode('list')}
              style={{
                ...styles.viewToggleBtn,
                backgroundColor: viewMode === 'list' ? '#3498db' : 'transparent',
                color: viewMode === 'list' ? 'white' : '#2c3e50'
              }}
            >
              📋 List
            </button>
            <button
              onClick={() => setViewMode('board')}
              style={{
                ...styles.viewToggleBtn,
                backgroundColor: viewMode === 'board' ? '#3498db' : 'transparent',
                color: viewMode === 'board' ? 'white' : '#2c3e50'
              }}
            >
              🎯 Board
            </button>
          </div>
        </div>
      </div>

      {/* Issues Content */}
      {filteredIssues.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🐛</div>
          <h3 style={styles.emptyTitle}>
            {issues.length === 0 ? 'No issues yet' : 'No issues found'}
          </h3>
          <p style={styles.emptyText}>
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first issue'}
          </p>
          <button 
            onClick={() => setShowCreateForm(true)}
            style={styles.btnPrimary}
          >
            Create Issue
          </button>
        </div>
      ) : viewMode === 'list' ? (
        <IssuesListView 
          issues={filteredIssues}
          onEdit={startEdit}
          onDelete={setDeleteConfirm}
          onStatusChange={handleStatusChange}
          onIssueClick={handleIssueClick}
          getStatusColor={getStatusColor}
          getPriorityColor={getPriorityColor}
          getPriorityIcon={getPriorityIcon}
        />
      ) : (
        <IssuesBoardView 
          issuesByStatus={issuesByStatus}
          onEdit={startEdit}
          onDelete={setDeleteConfirm}
          onStatusChange={handleStatusChange}
          onIssueClick={handleIssueClick}
          getStatusColor={getStatusColor}
          getPriorityColor={getPriorityColor}
          getPriorityIcon={getPriorityIcon}
        />
      )}

      {/* Create/Edit Modal */}
      {(showCreateForm || editingIssue) && (
        <IssueModal
          mode={editingIssue ? 'edit' : 'create'}
          issue={editingIssue}
          formData={formData}
          onFormDataChange={setFormData}
          onSubmit={editingIssue ? handleUpdateIssue : handleCreateIssue}
          onClose={() => {
            setShowCreateForm(false);
            setEditingIssue(null);
            setFormData({
              title: '',
              description: '',
              type: 'TASK',
              status: 'OPEN',
              priority: 'MEDIUM',
              projectId: 1,
              reporterId: currentUserId
            });
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <DeleteConfirmation
          issue={issues.find(i => i.id === deleteConfirm)}
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
      
      {/* Issue Detail View with Comments */}
      {selectedIssue && (
        <IssueDetailView
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onStatusChange={handleStatusChange}
          getStatusColor={getStatusColor}
          getPriorityColor={getPriorityColor}
          getPriorityIcon={getPriorityIcon}
        />
      )}
    </div>
  );
};

// List View Component
const IssuesListView: React.FC<{
  issues: Issue[];
  onEdit: (issue: Issue) => void;
  onDelete: (id: number) => void;
  onStatusChange: (issueId: number, newStatus: IssueStatus) => void;
  onIssueClick: (issue: Issue) => void;
  getStatusColor: (status: IssueStatus) => string;
  getPriorityColor: (priority: Priority) => string;
  getPriorityIcon: (priority: Priority) => string;
}> = ({ issues, onEdit, onDelete, onStatusChange, onIssueClick, getStatusColor, getPriorityColor, getPriorityIcon }) => (
  <div style={styles.issuesList}>
    {issues.map((issue, index) => (
      <IssueListItem 
        key={issue.id}
        issue={issue}
        onEdit={onEdit}
        onDelete={onDelete}
        onStatusChange={onStatusChange}
        onIssueClick={onIssueClick}
        getStatusColor={getStatusColor}
        getPriorityColor={getPriorityColor}
        getPriorityIcon={getPriorityIcon}
        isLast={index === issues.length - 1}
      />
    ))}
  </div>
);

// Board View Component
const IssuesBoardView: React.FC<{
  issuesByStatus: { [key in IssueStatus]: Issue[] };
  onEdit: (issue: Issue) => void;
  onDelete: (id: number) => void;
  onStatusChange: (issueId: number, newStatus: IssueStatus) => void;
  onIssueClick: (issue: Issue) => void;
  getStatusColor: (status: IssueStatus) => string;
  getPriorityColor: (priority: Priority) => string;
  getPriorityIcon: (priority: Priority) => string;
}> = ({ issuesByStatus, onEdit, onDelete, onStatusChange, onIssueClick, getStatusColor, getPriorityColor, getPriorityIcon }) => (
  <div style={styles.boardContainer}>
    {(['OPEN', 'IN_PROGRESS', 'CODE_REVIEW', 'TESTING', 'DONE', 'CLOSED'] as IssueStatus[]).map(status => (
      <div key={status} style={styles.boardColumn}>
        <div style={styles.columnHeader(getStatusColor(status))}>
          <span>{status.replace('_', ' ')}</span>
          <span style={styles.columnCount}>{issuesByStatus[status].length}</span>
        </div>
        <div style={styles.columnContent}>
          {issuesByStatus[status].map(issue => (
            <IssueCard 
              key={issue.id}
              issue={issue}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
              onIssueClick={onIssueClick}
              getStatusColor={getStatusColor}
              getPriorityColor={getPriorityColor}
              getPriorityIcon={getPriorityIcon}
            />
          ))}
          {issuesByStatus[status].length === 0 && (
            <div style={styles.emptyColumn}>
              No issues
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
);

// Issue List Item Component
const IssueListItem: React.FC<{
  issue: Issue;
  onEdit: (issue: Issue) => void;
  onDelete: (id: number) => void;
  onStatusChange: (issueId: number, newStatus: IssueStatus) => void;
  onIssueClick: (issue: Issue) => void;
  getStatusColor: (status: IssueStatus) => string;
  getPriorityColor: (priority: Priority) => string;
  getPriorityIcon: (priority: Priority) => string;
  isLast: boolean;
}> = ({ issue, onEdit, onDelete, onStatusChange, onIssueClick, getStatusColor, getPriorityColor, getPriorityIcon, isLast }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div 
      style={{
        ...styles.issueListItem,
        ...(isLast ? styles.issueListItemLast : {}),
        backgroundColor: showActions ? '#f8f9fa' : 'white'
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={() => onIssueClick(issue)}
    >
      <div style={styles.issueContent}>
        {/* Priority Icon */}
        <div style={styles.priorityIcon}>
          {getPriorityIcon(issue.priority)}
        </div>

        {/* Issue Content */}
        <div style={styles.issueDetails}>
          <div style={styles.issueHeader}>
            <div>
              <h3 style={styles.issueTitle}>{issue.key}: {issue.title}</h3>
              <div style={styles.issueMeta}>
                Type: {issue.type} • Reporter: {issue.reporter?.displayName || issue.reporter?.username}
              </div>
            </div>
            
            {/* Actions */}
            {showActions && (
              <div style={styles.issueActions}>
                <ActionButton icon="✏️" onClick={(e) => { e.stopPropagation(); onEdit(issue); }} />
                <ActionButton icon="🗑️" onClick={(e) => { e.stopPropagation(); onDelete(issue.id); }} color="#e74c3c" />
              </div>
            )}
          </div>

          <p style={styles.issueDescription}>
            {issue.description || 'No description provided'}
          </p>

          {/* Metadata */}
          <div style={styles.issueFooter}>
            {/* Status Dropdown */}
            <select
              value={issue.status}
              onChange={(e) => onStatusChange(issue.id, e.target.value as IssueStatus)}
              style={styles.statusDropdown(getStatusColor(issue.status))}
              onClick={(e) => e.stopPropagation()}
            >
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CODE_REVIEW">Code Review</option>
              <option value="TESTING">Testing</option>
              <option value="DONE">Done</option>
              <option value="CLOSED">Closed</option>
            </select>

            {/* Priority Badge */}
            <span style={styles.priorityBadge(getPriorityColor(issue.priority))}>
              {issue.priority}
            </span>

            {/* Project Info */}
            {issue.project && (
              <span style={styles.projectInfo}>
                Project: {issue.project.name}
              </span>
            )}

            {/* Assignee Info */}
            {issue.assignee && (
              <span style={styles.projectInfo}>
                Assignee: {issue.assignee.displayName || issue.assignee.username}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Issue Card Component (for board view)
const IssueCard: React.FC<{
  issue: Issue;
  onEdit: (issue: Issue) => void;
  onDelete: (id: number) => void;
  onStatusChange: (issueId: number, newStatus: IssueStatus) => void;
  onIssueClick: (issue: Issue) => void;
  getStatusColor: (status: IssueStatus) => string;
  getPriorityColor: (priority: Priority) => string;
  getPriorityIcon: (priority: Priority) => string;
}> = ({ issue, onEdit, onDelete, onStatusChange, onIssueClick, getStatusColor, getPriorityColor, getPriorityIcon }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div 
      style={{
        ...styles.issueCard,
        backgroundColor: showActions ? '#f8f9fa' : 'white'
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onClick={() => onIssueClick(issue)}
    >
      {/* Priority and Actions */}
      <div style={styles.cardHeader}>
        <div style={styles.cardPriority}>
          {getPriorityIcon(issue.priority)}
        </div>
        
        {showActions && (
          <div style={styles.cardActions}>
            <ActionButton icon="✏️" onClick={(e) => { e.stopPropagation(); onEdit(issue); }} size="small" />
            <ActionButton icon="🗑️" onClick={(e) => { e.stopPropagation(); onDelete(issue.id); }} color="#e74c3c" size="small" />
          </div>
        )}
      </div>

      {/* Issue Title */}
      <h4 style={styles.cardTitle}>
        {issue.title}
      </h4>

      {/* Issue Description */}
      {issue.description && (
        <p style={styles.cardDescription}>
          {issue.description.length > 100 
            ? `${issue.description.substring(0, 100)}...` 
            : issue.description
          }
        </p>
      )}

      {/* Status Dropdown */}
      <select
        value={issue.status}
        onChange={(e) => onStatusChange(issue.id, e.target.value as IssueStatus)}
        style={styles.cardStatusDropdown(getStatusColor(issue.status))}
        onClick={(e) => e.stopPropagation()}
      >
        <option value="OPEN">Open</option>
        <option value="IN_PROGRESS">In Progress</option>
        <option value="CODE_REVIEW">Code Review</option>
        <option value="TESTING">Testing</option>
        <option value="DONE">Done</option>
        <option value="CLOSED">Closed</option>
      </select>
    </div>
  );
};

// Action Button Component
const ActionButton: React.FC<{
  icon: string;
  onClick: (e: React.MouseEvent) => void;
  color?: string;
  size?: 'small' | 'normal';
}> = ({ icon, onClick, color, size = 'normal' }) => (
  <button
    onClick={onClick}
    style={{
      ...styles.actionBtn,
      ...(size === 'small' ? styles.actionBtnSmall : {}),
      color: color || '#7f8c8d'
    }}
    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
  >
    {icon}
  </button>
);

// Issue Modal Component
const IssueModal: React.FC<{
  mode: 'create' | 'edit';
  issue?: Issue | null;
  formData: IssueCreateRequest;
  onFormDataChange: (data: IssueCreateRequest) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}> = ({ mode, issue, formData, onFormDataChange, onSubmit, onClose }) => (
  <div style={styles.modalOverlay}>
    <form onSubmit={onSubmit} style={styles.modalContent}>
      <h2 style={styles.modalTitle}>
        {mode === 'create' ? 'Create New Issue' : 'Edit Issue'}
      </h2>

      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => onFormDataChange({ ...formData, title: e.target.value })}
          required
          placeholder="Enter issue title"
          style={styles.formInput}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => onFormDataChange({ ...formData, description: e.target.value })}
          placeholder="Describe the issue..."
          rows={4}
          style={styles.formTextarea}
        />
      </div>

      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Type *</label>
          <select
            value={formData.type}
            onChange={(e) => onFormDataChange({ ...formData, type: e.target.value as IssueType })}
            style={styles.formInput}
          >
            <option value="TASK">Task</option>
            <option value="STORY">Story</option>
            <option value="BUG">Bug</option>
            <option value="EPIC">Epic</option>
            <option value="SUBTASK">Subtask</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Status</label>
          <select
            value={formData.status}
            onChange={(e) => onFormDataChange({ ...formData, status: e.target.value as IssueStatus })}
            style={styles.formInput}
          >
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CODE_REVIEW">Code Review</option>
            <option value="TESTING">Testing</option>
            <option value="DONE">Done</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      <div style={styles.formRow}>
        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => onFormDataChange({ ...formData, priority: e.target.value as Priority })}
            style={styles.formInput}
          >
            <option value="LOWEST">Lowest</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="HIGHEST">Highest</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.formLabel}>Project ID *</label>
          <input
            type="number"
            value={formData.projectId}
            onChange={(e) => onFormDataChange({ ...formData, projectId: parseInt(e.target.value) })}
            required
            placeholder="Enter project ID"
            style={styles.formInput}
          />
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.formLabel}>Assignee ID (Optional)</label>
        <input
          type="number"
          value={formData.assigneeId || ''}
          onChange={(e) => onFormDataChange({ 
            ...formData, 
            assigneeId: e.target.value ? parseInt(e.target.value) : undefined 
          })}
          placeholder="Enter assignee user ID"
          style={styles.formInput}
        />
      </div>

      <div style={styles.modalActions}>
        <button type="button" style={styles.btnSecondary} onClick={onClose}>
          Cancel
        </button>
        <button type="submit" style={styles.btnPrimary}>
          {mode === 'create' ? 'Create Issue' : 'Save Changes'}
        </button>
      </div>
    </form>
  </div>
);

// Delete Confirmation Component
const DeleteConfirmation: React.FC<{
  issue?: Issue;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ issue, onConfirm, onCancel }) => (
  <div style={styles.modalOverlay}>
    <div style={styles.confirmationModal}>
      <div style={styles.confirmationIcon}>⚠️</div>
      <h3 style={styles.confirmationTitle}>Delete Issue</h3>
      <p style={styles.confirmationText}>
        Are you sure you want to delete <strong>"{issue?.title}"</strong>? This action cannot be undone.
      </p>
      <div style={styles.confirmationActions}>
        <button style={styles.btnSecondary} onClick={onCancel}>
          Cancel
        </button>
        <button style={styles.btnDanger} onClick={onConfirm}>
          Delete Issue
        </button>
      </div>
    </div>
  </div>
);

// Issue Detail View Component
// In your IssuesPage component, update the IssueDetailView component:

const IssueDetailView: React.FC<{
  issue: Issue;
  onClose: () => void;
  onStatusChange: (issueId: number, newStatus: IssueStatus) => void;
  getStatusColor: (status: IssueStatus) => string;
  getPriorityColor: (priority: Priority) => string;
  getPriorityIcon: (priority: Priority) => string;
}> = ({ issue, onClose, onStatusChange, getStatusColor, getPriorityColor, getPriorityIcon }) => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  // Add error boundary for CommentsSection
  const [commentsError, setCommentsError] = useState<string | null>(null);

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.issueDetailModal}>
        {/* Issue Header */}
        <div style={styles.detailHeader}>
          <div style={styles.detailTitle}>
            <div style={styles.titleRow}>
              <h2 style={styles.detailTitleText}>{issue.key}: {issue.title}</h2>
              <div style={styles.statusBadges}>
                <span style={styles.statusBadge(getStatusColor(issue.status))}>
                  {issue.status.replace('_', ' ')}
                </span>
                <span style={styles.priorityBadge(getPriorityColor(issue.priority))}>
                  {getPriorityIcon(issue.priority)} {issue.priority}
                </span>
              </div>
            </div>
            
            <div style={styles.detailMeta}>
              <div>
                <strong>Type:</strong> {issue.type}
              </div>
              <div>
                <strong>Reporter:</strong> {issue.reporter?.displayName || issue.reporter?.username || 'Unknown'}
              </div>
              {issue.assignee && (
                <div>
                  <strong>Assignee:</strong> {issue.assignee.displayName || issue.assignee.username}
                </div>
              )}
            </div>
          </div>
          
          <button style={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Issue Description */}
        <div style={styles.detailSection}>
          <h4 style={styles.detailSectionTitle}>Description</h4>
          <div style={styles.descriptionContent}>
            {issue.description || 'No description provided.'}
          </div>
        </div>

        {/* Comments Section with Error Handling */}
        <div style={styles.detailSection}>
          {commentsError ? (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#ffeaa7', 
              border: '1px solid #fdcb6e',
              borderRadius: '6px',
              color: '#e17055'
            }}>
              <p>Error loading comments: {commentsError}</p>
              <button 
                onClick={() => setCommentsError(null)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#e17055',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Retry
              </button>
            </div>
          ) : (
            <CommentsSection
              issueId={issue.id}
              currentUser={currentUser}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default IssuesPage;