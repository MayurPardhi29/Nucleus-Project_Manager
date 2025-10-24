import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/axiosClient';
import type { Project, Issue, User } from '../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    projects: 0,
    issues: 0,
    openIssues: 0,
    inProgressIssues: 0,
    closedIssues: 0,
    users: 0
  });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
  const [assignedIssues, setAssignedIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'myIssues'>('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, issuesRes, usersRes, openIssuesRes, inProgressIssuesRes] = await Promise.all([
        api.projects.getAll(),
        api.issues.getAll(),
        api.users.getAll(),
        api.issues.search('OPEN'),
        api.issues.search('IN_PROGRESS')
      ]);

      const projects = projectsRes.data.data || [];
      const issues = issuesRes.data.data || [];
      const users = usersRes.data.data || [];
      const openIssues = openIssuesRes.data.data || [];
      const inProgressIssues = inProgressIssuesRes.data.data || [];

      setStats({
        projects: projects.length,
        issues: issues.length,
        openIssues: openIssues.length,
        inProgressIssues: inProgressIssues.length,
        closedIssues: issues.length - (openIssues.length + inProgressIssues.length),
        users: users.length
      });

      // Get recent projects (last 3)
      setRecentProjects(projects.slice(-3).reverse());

      // Get recent issues (last 5)
      setRecentIssues(issues.slice(-5).reverse());

      // For demo purposes, show some issues as "assigned"
      // In real app, this would filter by current user
      setAssignedIssues(issues.slice(0, 3));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return '#27ae60';
      case 'MEDIUM': return '#f39c12';
      case 'HIGH': return '#e74c3c';
      case 'CRITICAL': return '#c0392b';
      default: return '#95a5a6';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return '#e74c3c';
      case 'IN_PROGRESS': return '#3498db';
      case 'CLOSED': return '#27ae60';
      default: return '#95a5a6';
    }
  };

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
          <p>Loading dashboard...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          margin: '0 0 0.5rem 0', 
          color: '#2c3e50',
          fontSize: '2rem',
          fontWeight: '600'
        }}>
          Dashboard
        </h1>
        <p style={{ 
          margin: 0, 
          color: '#7f8c8d',
          fontSize: '1.1rem'
        }}>
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <StatCard 
          title="Total Projects" 
          value={stats.projects} 
          color="#3498db" 
          icon="📁"
          description="Active projects"
        />
        <StatCard 
          title="Total Issues" 
          value={stats.issues} 
          color="#e74c3c" 
          icon="🐛"
          description="All tickets"
        />
        <StatCard 
          title="Open Issues" 
          value={stats.openIssues} 
          color="#f39c12" 
          icon="⏳"
          description="Needs attention"
        />
        <StatCard 
          title="Team Members" 
          value={stats.users} 
          color="#27ae60" 
          icon="👥"
          description="Active users"
        />
      </div>

      {/* Issue Status Overview */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2c3e50' }}>Issue Status Overview</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <StatusProgress 
            label="Open" 
            value={stats.openIssues} 
            total={stats.issues} 
            color="#e74c3c" 
          />
          <StatusProgress 
            label="In Progress" 
            value={stats.inProgressIssues} 
            total={stats.issues} 
            color="#3498db" 
          />
          <StatusProgress 
            label="Closed" 
            value={stats.closedIssues} 
            total={stats.issues} 
            color="#27ae60" 
          />
        </div>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{
          display: 'flex',
          borderBottom: '2px solid #ecf0f1',
          gap: '2rem'
        }}>
          <TabButton 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </TabButton>
          <TabButton 
            active={activeTab === 'myIssues'} 
            onClick={() => setActiveTab('myIssues')}
          >
            My Assigned Issues
          </TabButton>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem'
        }}>
          {/* Recent Projects */}
          <Section 
            title="Recent Projects" 
            action={<Link to="/projects" style={{ color: '#3498db', textDecoration: 'none' }}>View All</Link>}
          >
            {recentProjects.length > 0 ? (
              recentProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <EmptyState message="No projects yet" />
            )}
          </Section>

          {/* Recent Issues */}
          <Section 
            title="Recent Issues" 
            action={<Link to="/issues" style={{ color: '#3498db', textDecoration: 'none' }}>View All</Link>}
          >
            {recentIssues.length > 0 ? (
              recentIssues.map(issue => (
                <IssueCard key={issue.id} issue={issue} />
              ))
            ) : (
              <EmptyState message="No issues yet" />
            )}
          </Section>
        </div>
      ) : (
        /* My Issues Tab */
        <Section title="Issues Assigned to Me">
          {assignedIssues.length > 0 ? (
            assignedIssues.map(issue => (
              <IssueCard key={issue.id} issue={issue} showProject={true} />
            ))
          ) : (
            <EmptyState 
              message="No issues assigned to you" 
              action={
                <Link 
                  to="/issues" 
                  style={{
                    display: 'inline-block',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#3498db',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    marginTop: '1rem'
                  }}
                >
                  Browse Issues
                </Link>
              }
            />
          )}
        </Section>
      )}

      {/* Quick Actions */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginTop: '2rem'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#2c3e50' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <QuickAction 
            icon="➕" 
            label="Create Project" 
            to="/projects" 
          />
          <QuickAction 
            icon="🐛" 
            label="Report Issue" 
            to="/issues" 
          />
          <QuickAction 
            icon="👥" 
            label="Manage Team" 
            to="/users" 
          />
          <QuickAction 
            icon="📊" 
            label="View Reports" 
            to="/issues" 
          />
        </div>
      </div>
    </div>
  );
};

// Component for Stat Cards
const StatCard: React.FC<{ 
  title: string; 
  value: number; 
  color: string; 
  icon: string;
  description: string;
}> = ({ title, value, color, icon, description }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    borderLeft: `4px solid ${color}`,
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  }}>
    <div style={{
      width: '50px',
      height: '50px',
      backgroundColor: color + '20',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem'
    }}>
      {icon}
    </div>
    <div>
      <h3 style={{ 
        margin: '0 0 0.25rem 0', 
        color: '#2c3e50',
        fontSize: '1.1rem',
        fontWeight: '600'
      }}>
        {title}
      </h3>
      <p style={{ 
        margin: '0 0 0.25rem 0', 
        color: color,
        fontSize: '2rem',
        fontWeight: 'bold'
      }}>
        {value}
      </p>
      <p style={{ 
        margin: 0, 
        color: '#7f8c8d',
        fontSize: '0.9rem'
      }}>
        {description}
      </p>
    </div>
  </div>
);

// Component for Status Progress
const StatusProgress: React.FC<{
  label: string;
  value: number;
  total: number;
  color: string;
}> = ({ label, value, total, color }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  
  return (
    <div style={{ flex: 1 }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        marginBottom: '0.5rem' 
      }}>
        <span style={{ color: '#2c3e50', fontWeight: '500' }}>{label}</span>
        <span style={{ color: '#7f8c8d' }}>{value} ({Math.round(percentage)}%)</span>
      </div>
      <div style={{
        width: '100%',
        height: '8px',
        backgroundColor: '#ecf0f1',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: '4px',
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );
};

// Component for Tabs
const TabButton: React.FC<{ 
  active: boolean; 
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      padding: '0.75rem 1rem',
      backgroundColor: 'transparent',
      border: 'none',
      borderBottom: active ? '2px solid #3498db' : '2px solid transparent',
      color: active ? '#3498db' : '#7f8c8d',
      fontWeight: active ? '600' : '400',
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'all 0.2s',
      marginBottom: '-2px'
    }}
  >
    {children}
  </button>
);

// Component for Sections
const Section: React.FC<{
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, action, children }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }}>
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginBottom: '1rem'
    }}>
      <h3 style={{ margin: 0, color: '#2c3e50' }}>{title}</h3>
      {action}
    </div>
    {children}
  </div>
);

// Component for Project Cards
const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <div style={{
    padding: '1rem',
    border: '1px solid #ecf0f1',
    borderRadius: '6px',
    marginBottom: '0.75rem',
    transition: 'all 0.2s',
    cursor: 'pointer'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = '#3498db';
    e.currentTarget.style.boxShadow = '0 2px 8px rgba(52, 152, 219, 0.1)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = '#ecf0f1';
    e.currentTarget.style.boxShadow = 'none';
  }}
  >
    <h4 style={{ 
      margin: '0 0 0.5rem 0', 
      color: '#2c3e50',
      fontSize: '1rem'
    }}>
      {project.name}
    </h4>
    <p style={{ 
      margin: '0 0 0.5rem 0', 
      color: '#7f8c8d',
      fontSize: '0.9rem'
    }}>
      {project.description || 'No description'}
    </p>
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span style={{ 
        color: '#3498db', 
        fontSize: '0.8rem',
        fontWeight: '500'
      }}>
        Owner: {project.owner?.displayName || project.owner?.username || 'Unknown'}
      </span>
      <span style={{
        color: '#3498db', 
        fontSize: '0.8rem',
        fontWeight: '500'
      }
      }>
        🐛 {project.issueCount || 0}
      </span>
      <span style={{
        color: '#3498db', 
        fontSize: '0.8rem',
        fontWeight: '500'
      }}>
        👥 {project.memberCount || 0}
      </span>
    </div>
  </div>
);

// Component for Issue Cards
const IssueCard: React.FC<{ 
  issue: Issue; 
  showProject?: boolean;
}> = ({ issue, showProject = false }) => (
  <div style={{
    padding: '1rem',
    border: '1px solid #ecf0f1',
    borderRadius: '6px',
    marginBottom: '0.75rem',
    transition: 'all 0.2s',
    cursor: 'pointer'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = '#3498db';
    e.currentTarget.style.boxShadow = '0 2px 8px rgba(52, 152, 219, 0.1)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = '#ecf0f1';
    e.currentTarget.style.boxShadow = 'none';
  }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
      <h4 style={{ 
        margin: '0 0 0.5rem 0', 
        color: '#2c3e50',
        fontSize: '1rem',
        flex: 1
      }}>
        {issue.key}: {issue.title}
      </h4>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{
          backgroundColor: getStatusColor(issue.status),
          color: 'white',
          padding: '0.25rem 0.5rem',
          borderRadius: '4px',
          fontSize: '0.7rem',
          fontWeight: '500'
        }}>
          {issue.status.replace('_', ' ')}
        </span>
        <span style={{
          backgroundColor: getPriorityColor(issue.priority),
          color: 'white',
          padding: '0.25rem 0.5rem',
          borderRadius: '4px',
          fontSize: '0.7rem',
          fontWeight: '500'
        }}>
          {issue.priority}
        </span>
      </div>
    </div>
    <p style={{ 
      margin: '0 0 0.5rem 0', 
      color: '#7f8c8d',
      fontSize: '0.9rem'
    }}>
      {issue.description || 'No description provided'}
    </p>
    {showProject && issue.projectId && (
      <div style={{ 
        color: '#3498db', 
        fontSize: '0.8rem',
        fontWeight: '500'
      }}>
        Project: {issue.project.name}
      </div>
    )}
  </div>
);

// Component for Empty States
const EmptyState: React.FC<{ 
  message: string; 
  action?: React.ReactNode;
}> = ({ message, action }) => (
  <div style={{ 
    textAlign: 'center', 
    padding: '2rem',
    color: '#7f8c8d'
  }}>
    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📋</div>
    <p style={{ margin: '0 0 1rem 0' }}>{message}</p>
    {action}
  </div>
);

// Component for Quick Actions
const QuickAction: React.FC<{
  icon: string;
  label: string;
  to: string;
}> = ({ icon, label, to }) => (
  <Link 
    to={to}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1rem',
      backgroundColor: '#f8f9fa',
      borderRadius: '6px',
      textDecoration: 'none',
      color: '#2c3e50',
      transition: 'all 0.2s',
      border: '1px solid transparent'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = '#3498db';
      e.currentTarget.style.color = 'white';
      e.currentTarget.style.borderColor = '#3498db';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = '#f8f9fa';
      e.currentTarget.style.color = '#2c3e50';
      e.currentTarget.style.borderColor = 'transparent';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
  >
    <span style={{ fontSize: '1.2rem' }}>{icon}</span>
    <span style={{ fontWeight: '500' }}>{label}</span>
  </Link>
);

// Helper functions for colors (defined outside component)
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'LOW': return '#27ae60';
    case 'MEDIUM': return '#f39c12';
    case 'HIGH': return '#e74c3c';
    case 'CRITICAL': return '#c0392b';
    default: return '#95a5a6';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'OPEN': return '#e74c3c';
    case 'IN_PROGRESS': return '#3498db';
    case 'CLOSED': return '#27ae60';
    default: return '#95a5a6';
  }
};

export default Dashboard;