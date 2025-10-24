import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types/User';

interface RequireAuthProps {
  children: React.ReactNode;
  roles?: UserRole | UserRole[];
  fallback?: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children, 
  roles, 
  fallback 
}) => {
  const { isAuthenticated, hasRole, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
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
          <p>Checking authentication...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !hasRole(roles)) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        maxWidth: '500px',
        margin: '0 auto'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚫</div>
        <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Access Denied</h2>
        <p style={{ color: '#7f8c8d', marginBottom: '2rem' }}>
          You don't have permission to access this page. 
          Required roles: {Array.isArray(roles) ? roles.join(', ') : roles}
        </p>
        <button 
          onClick={() => window.history.back()}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireAuth;