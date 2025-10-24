import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api/axiosClient';
interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  role: string;
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // Demo count

useEffect(() => {
  const userData = localStorage.getItem('user');
  const authToken = localStorage.getItem('authToken');
  
  console.log('🔍 Navbar Debug - User data from localStorage:', userData);
  console.log('🔍 Navbar Debug - Auth token exists:', !!authToken);
  
  if (userData) {
    try {
      const parsedUser = JSON.parse(userData);
      console.log('🔍 Navbar Debug - Parsed user object:', parsedUser);
      console.log('🔍 Navbar Debug - Email in user object:', parsedUser.email);
      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
}, []);

// In your Navbar or wherever you handle logout
  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and redirect
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return '#e74c3c';
      case 'ORG_ADMIN': return '#9b59b6';
      case 'PROJECT_ADMIN': return '#3498db';
      case 'DEVELOPER': return '#2ecc71';
      case 'VIEWER': return '#f39c12';
      default: return '#95a5a6';
    }
  };

  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path === '/projects') return 'Projects';
    if (path === '/issues') return 'Issues';
    if (path === '/users') return 'Team Management';
    if (path === '/settings') return 'Settings';
    if (path === '/help') return 'Help & Support';
    if (path === '/calendar') return 'Calendar';
    return 'Dashboard';
  };

  const clearNotifications = () => {
    setNotificationCount(0);
  };

  return (
    <nav style={{ 
      backgroundColor: '#2c3e50', 
      padding: '0 1.5rem',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '60px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Left Section - Logo and Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer'
        }} onClick={() => navigate('/dashboard')}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#3498db',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1.2rem'
          }}>
            ⚡
          </div>
          <span style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #3498db, #9b59b6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Nucleus
          </span>
        </div>

        {/* Breadcrumb for larger screens */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#bdc3c7',
          fontSize: '0.9rem',
          marginLeft: '2rem'
        }} className="breadcrumb">
          <span 
            style={{ 
              cursor: 'pointer',
              transition: 'color 0.2s'
            }}
            onClick={() => navigate('/dashboard')}
            onMouseEnter={(e) => e.currentTarget.style.color = '#ecf0f1'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#bdc3c7'}
          >
            Dashboard
          </span>
          <span style={{ color: '#7f8c8d' }}>›</span>
          <span style={{ color: '#ecf0f1', fontWeight: '500' }}>
            {getPageTitle()}
          </span>
        </div>
      </div>

      {/* Right Section - User Info */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem',
        position: 'relative'
      }}>
        {/* Quick Actions */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: '0.5rem'
        }} className="quick-actions">
          <button
            onClick={() => navigate('/issues')}
            style={{
              padding: '0.4rem 0.8rem',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px',
              color: 'white',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            🐛 Issues
          </button>
          <button
            onClick={() => navigate('/projects')}
            style={{
              padding: '0.4rem 0.8rem',
              backgroundColor: 'rgba(52, 152, 219, 0.3)',
              border: '1px solid rgba(52, 152, 219, 0.5)',
              borderRadius: '6px',
              color: 'white',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(52, 152, 219, 0.5)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(52, 152, 219, 0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            📁 Projects
          </button>
        </div>

        {/* Notifications Bell */}
        <div style={{
          position: 'relative'
        }}>
          <div
            style={{
              padding: '0.5rem',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              position: 'relative'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={clearNotifications}
          >
            <span style={{ fontSize: '1.2rem' }}>🔔</span>
            {notificationCount > 0 && (
              <div style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '18px',
                height: '18px',
                backgroundColor: '#e74c3c',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                color: 'white'
              }}>
                {notificationCount}
              </div>
            )}
          </div>
        </div>

        {/* User Profile */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            backgroundColor: showDropdown ? 'rgba(255,255,255,0.15)' : 'transparent'
          }}
          onClick={() => setShowDropdown(!showDropdown)}
          onMouseEnter={(e) => !showDropdown && (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
          onMouseLeave={(e) => !showDropdown && (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          {/* User Avatar */}
          <div style={{
            width: '36px',
            height: '36px',
            backgroundColor: '#3498db',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            color: 'white',
            background: 'linear-gradient(135deg, #3498db, #9b59b6)'
          }}>
            {user ? getInitials(user.displayName || user.username) : 'U'}
          </div>

          {/* User Info - Hidden on mobile */}
          <div style={{ 
            display: 'none',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '0.1rem'
          }} className="user-info">
            <span style={{ 
              fontSize: '0.9rem', 
              fontWeight: '600',
              maxWidth: '120px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {user?.displayName || user?.username}
            </span>
            <span style={{
              fontSize: '0.75rem',
              color: 'white',
              backgroundColor: getRoleBadgeColor(user?.role || ''),
              padding: '0.2rem 0.5rem',
              borderRadius: '12px',
              fontWeight: '500'
            }}>
              {user?.role?.replace('_', ' ') || 'User'}
            </span>
          </div>

          {/* Dropdown Arrow */}
          <span style={{
            transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
            fontSize: '0.8rem',
            color: '#bdc3c7'
          }}>
            ▼
          </span>
        </div>

        {/* Dropdown Menu */}
        {showDropdown && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: '220px',
            marginTop: '0.5rem',
            overflow: 'hidden',
            zIndex: 1000,
            border: '1px solid #e1e8ed'
          }}>
            {/* User Info in Dropdown */}
            <div style={{
              padding: '1rem',
              backgroundColor: '#f8f9fa',
              borderBottom: '1px solid #ecf0f1'
            }}>
              <div style={{ 
                fontWeight: '600', 
                color: '#2c3e50',
                fontSize: '1rem',
                marginBottom: '0.25rem'
              }}>
                {user?.displayName || user?.username}
              </div>
              <div style={{ 
                fontSize: '0.8rem', 
                color: '#7f8c8d',
                marginBottom: '0.5rem'
              }}>
                {user?.email || 'user@example.com'}
              </div>
              <div style={{
                display: 'inline-block',
                padding: '0.25rem 0.75rem',
                backgroundColor: getRoleBadgeColor(user?.role || ''),
                color: 'white',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: '600',
                textTransform: 'capitalize'
              }}>
                {user?.role?.toLowerCase().replace('_', ' ') || 'user'}
              </div>
            </div>

            {/* Dropdown Items */}
            <div style={{ padding: '0.5rem' }}>
              <DropdownItem 
                icon="👤" 
                label="My Profile" 
                onClick={() => {
                  setShowDropdown(false);
                  navigate('/settings');
                }}
              />
              <DropdownItem 
                icon="⚙️" 
                label="Settings" 
                onClick={() => {
                  setShowDropdown(false);
                  navigate('/settings');
                }}
              />
              <DropdownItem 
                icon="📅" 
                label="Calendar" 
                onClick={() => {
                  setShowDropdown(false);
                  navigate('/calendar');
                }}
              />
              <DropdownItem 
                icon="❓" 
                label="Help & Support" 
                onClick={() => {
                  setShowDropdown(false);
                  navigate('/help');
                }}
              />
              
              <div style={{ 
                height: '1px', 
                backgroundColor: '#ecf0f1', 
                margin: '0.5rem 0' 
              }} />
              
              <DropdownItem 
                icon="🚪" 
                label="Logout" 
                onClick={handleLogout}
                color="#e74c3c"
              />
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setShowDropdown(false)}
        />
      )}

      <style>
        {`
          @media (min-width: 768px) {
            .breadcrumb, .user-info, .quick-actions {
              display: flex !important;
            }
          }
          
          @media (min-width: 1024px) {
            .quick-actions {
              display: flex !important;
            }
          }
        `}
      </style>
    </nav>
  );
};

// Dropdown Item Component
const DropdownItem: React.FC<{
  icon: string;
  label: string;
  onClick: () => void;
  color?: string;
}> = ({ icon, label, onClick, color }) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1rem',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      color: color || '#2c3e50',
      fontSize: '0.9rem'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = '#f8f9fa';
      e.currentTarget.style.transform = 'translateX(4px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = 'transparent';
      e.currentTarget.style.transform = 'translateX(0)';
    }}
  >
    <span style={{ fontSize: '1.1rem', width: '20px' }}>{icon}</span>
    <span style={{ fontWeight: '500' }}>{label}</span>
  </div>
);

export default Navbar;