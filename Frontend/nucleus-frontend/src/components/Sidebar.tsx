import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api/axiosClient'; // Import your existing API client

interface MenuItem {
  path: string;
  label: string;
  icon: string;
  badge?: number;
}

interface DashboardStats {
  projects: number;
  issues: number;
  openIssues: number;
  inProgressIssues: number;
  doneIssues: number;
  users: number;
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    issues: 0,
    openIssues: 0,
    inProgressIssues: 0,
    doneIssues: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch stats data using your existing API client (like your dashboard component)
  const fetchStatsData = async () => {
    try {
      setLoading(true);
      
      // Use the same approach as your dashboard component
      const [projectsRes, issuesRes, usersRes] = await Promise.all([
        api.projects.getAll(),
        api.issues.getAll(),
        api.users.getAll()
      ]);

      // Use the exact same data processing as your dashboard
      const projects = projectsRes.data.data || [];
      const issues = issuesRes.data.data || [];
      const users = usersRes.data.data || [];

      // Count issues by status (same logic as your dashboard)
      const openIssues = issues.filter((issue: any) => issue.status === 'OPEN');
      const inProgressIssues = issues.filter((issue: any) => issue.status === 'IN_PROGRESS');
      const doneIssues = issues.filter((issue: any) => 
        issue.status === 'DONE' || issue.status === 'CLOSED'
      );

      console.log('Sidebar Data:', {
        projects: projects.length,
        issues: issues.length,
        openIssues: openIssues.length,
        inProgressIssues: inProgressIssues.length,
        doneIssues: doneIssues.length,
        users: users.length
      });

      setStats({
        projects: projects.length,
        issues: issues.length,
        openIssues: openIssues.length,
        inProgressIssues: inProgressIssues.length,
        doneIssues: doneIssues.length,
        users: users.length
      });

    } catch (error) {
      console.error('Error fetching sidebar data:', error);
      // Set demo data for development
      setStats({
        projects: 8,
        issues: 23,
        openIssues: 12,
        inProgressIssues: 7,
        doneIssues: 4,
        users: 15
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatsData();
  }, []);

  const menuItems: MenuItem[] = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/projects', label: 'Projects', icon: '📁', badge: stats.projects },
    { path: '/issues', label: 'Issues', icon: '🐛', badge: stats.issues },
    { path: '/users', label: 'Team', icon: '👥', badge: stats.users },
    { path: '/reports', label: 'Reports', icon: '📈' },
    { path: '/calendar', label: 'Calendar', icon: '📅' },
  ];

  const secondaryItems: MenuItem[] = [
    { path: '/settings', label: 'Settings', icon: '⚙️' },
    { path: '/help', label: 'Help & Support', icon: '❓' },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div style={{
      width: collapsed ? '70px' : '250px',
      backgroundColor: '#34495e',
      color: 'white',
      height: 'calc(100vh - 60px)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s ease',
      position: 'sticky',
      top: '60px',
      flexShrink: 0,
      zIndex: 100
    }}>
      {/* Collapse Toggle */}
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid #2c3e50',
        display: 'flex',
        justifyContent: collapsed ? 'center' : 'flex-end'
      }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'none',
            border: 'none',
            color: '#bdc3c7',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '4px',
            transition: 'background-color 0.2s',
            fontSize: '1.1rem'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {collapsed ? '➡️' : '⬅️'}
        </button>
      </div>

      {/* Main Navigation */}
      <div style={{ 
        flex: 1, 
        padding: '1rem 0',
        overflowY: 'auto'
      }}>
        <div style={{ 
          padding: collapsed ? '0 0.5rem' : '0 1rem',
          marginBottom: '1rem'
        }}>
          {!collapsed && (
            <div style={{
              fontSize: '0.75rem',
              color: '#95a5a6',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '0.5rem',
              padding: '0 1rem'
            }}>
              Main
            </div>
          )}
          
          {menuItems.map((item) => (
            <SidebarItem
              key={item.path}
              item={item}
              isActive={isActive(item.path)}
              collapsed={collapsed}
              onClick={() => navigate(item.path)}
            />
          ))}
        </div>

        {/* Secondary Navigation */}
        <div style={{ 
          padding: collapsed ? '0 0.5rem' : '0 1rem',
          marginTop: '2rem'
        }}>
          {!collapsed && (
            <div style={{
              fontSize: '0.75rem',
              color: '#95a5a6',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '0.5rem',
              padding: '0 1rem'
            }}>
              System
            </div>
          )}
          
          {secondaryItems.map((item) => (
            <SidebarItem
              key={item.path}
              item={item}
              isActive={isActive(item.path)}
              collapsed={collapsed}
              onClick={() => navigate(item.path)}
            />
          ))}
        </div>
      </div>

      {/* Quick Stats - Only show when expanded */}
      {!collapsed && !loading && (
        <div style={{
          padding: '1rem',
          borderTop: '1px solid #2c3e50',
          backgroundColor: 'rgba(52, 73, 94, 0.8)'
        }}>
          <div style={{ 
            fontSize: '0.8rem', 
            color: '#bdc3c7',
            marginBottom: '0.5rem'
          }}>
            Quick Stats
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '0.9rem', 
                fontWeight: 'bold', 
                color: '#e74c3c'
              }}>
                {stats.openIssues}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#95a5a6' }}>Open</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '0.9rem', 
                fontWeight: 'bold', 
                color: '#f39c12'
              }}>
                {stats.inProgressIssues}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#95a5a6' }}>Progress</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '0.9rem', 
                fontWeight: 'bold', 
                color: '#27ae60'
              }}>
                {stats.doneIssues}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#95a5a6' }}>Done</div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {!collapsed && loading && (
        <div style={{
          padding: '1rem',
          borderTop: '1px solid #2c3e50',
          backgroundColor: 'rgba(52, 73, 94, 0.8)'
        }}>
          <div style={{ 
            fontSize: '0.8rem', 
            color: '#bdc3c7',
            marginBottom: '0.5rem'
          }}>
            Loading Stats...
          </div>
        </div>
      )}
    </div>
  );
};

// Sidebar Item Component (unchanged from your original)
const SidebarItem: React.FC<{
  item: MenuItem;
  isActive: boolean;
  collapsed: boolean;
  onClick: () => void;
}> = ({ item, isActive, collapsed, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: collapsed ? '0.75rem' : '0.75rem 1rem',
        borderRadius: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        backgroundColor: isActive 
          ? '#3498db' 
          : (isHovered ? 'rgba(255,255,255,0.1)' : 'transparent'),
        marginBottom: '0.25rem',
        position: 'relative',
        justifyContent: collapsed ? 'center' : 'flex-start'
      }}
    >
      {/* Icon */}
      <span style={{ 
        fontSize: '1.2rem',
        marginRight: collapsed ? '0' : '0.75rem',
        transition: 'margin-right 0.3s'
      }}>
        {item.icon}
      </span>

      {/* Label - Hidden when collapsed */}
      {!collapsed && (
        <span style={{
          fontSize: '0.9rem',
          fontWeight: isActive ? '600' : '400',
          flex: 1,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {item.label}
        </span>
      )}

      {/* Badge */}
      {item.badge !== undefined && item.badge > 0 && !collapsed && (
        <span style={{
          backgroundColor: '#e74c3c',
          color: 'white',
          borderRadius: '10px',
          padding: '0.1rem 0.4rem',
          fontSize: '0.7rem',
          fontWeight: '600',
          minWidth: '20px',
          textAlign: 'center'
        }}>
          {item.badge > 99 ? '99+' : item.badge}
        </span>
      )}

      {/* Tooltip for collapsed state */}
      {collapsed && isHovered && (
        <div style={{
          position: 'absolute',
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          backgroundColor: '#2c3e50',
          color: 'white',
          padding: '0.5rem 0.75rem',
          borderRadius: '4px',
          fontSize: '0.8rem',
          fontWeight: '500',
          whiteSpace: 'nowrap',
          zIndex: 1000,
          marginLeft: '0.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}>
          {item.label}
          {/* Tooltip arrow */}
          <div style={{
            position: 'absolute',
            right: '100%',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderTop: '4px solid transparent',
            borderBottom: '4px solid transparent',
            borderRight: '4px solid #2c3e50'
          }} />
        </div>
      )}
    </div>
  );
};

export default Sidebar;