// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProjectsPage from './pages/ProjectsPage';
import IssuesPage from './pages/IssuesPage';
import UsersPage from './pages/UsersPage';
import RequireAuth from './components/RequireAuth';
import SettingsPage from './pages/SettingsPage';
import HelpSupportPage from './pages/HelpSupportPage';
import CalendarPage from './pages/CalendarPage'; 

import './index.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('authToken');
  return token ? <>{children}</> : <Navigate to="/login" />;
};

const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('authToken');
  const location = useLocation();
  
  if (token) {
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <div style={{ flex: 1, overflow: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          
          <Route path="/login" element={
            <AuthRoute>
              <LoginPage />
            </AuthRoute>
          } />

          {/* Protected routes */}
          <Route path="/dashboard" element={
            <RequireAuth>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </RequireAuth>
          } />
          
          <Route path="/projects" element={
            <RequireAuth>
              <MainLayout>
                <ProjectsPage />
              </MainLayout>
            </RequireAuth>
          } />
          
          <Route path="/issues" element={
            <RequireAuth>
              <MainLayout>
                <IssuesPage />
              </MainLayout>
            </RequireAuth>
          } />
          
          {/* Admin/Manager only routes */}
          <Route path="/users" element={
            <RequireAuth roles={['SUPER_ADMIN', 'ORG_ADMIN', 'DEVELOPER']}>
              <MainLayout>
                <UsersPage />
              </MainLayout>
            </RequireAuth>
          } />
          
          <Route path="/settings" element={
            <RequireAuth>
              <MainLayout>
                <SettingsPage />
              </MainLayout>
            </RequireAuth>
          } />
          
          <Route path="/help" element={
            <RequireAuth>
              <MainLayout>
                <HelpSupportPage />
              </MainLayout>
            </RequireAuth>
          } />

          {/* Calendar Route - Fixed */}
          <Route path="/calendar" element={
            <RequireAuth>
              <MainLayout>
                <CalendarPage />
              </MainLayout>
            </RequireAuth>
          } />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;