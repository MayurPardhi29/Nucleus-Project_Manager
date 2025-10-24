import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  role: string;
}

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form states
  const [profileForm, setProfileForm] = useState({
    displayName: '',
    email: '',
    username: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    theme: 'light',
    language: 'en'
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setProfileForm({
          displayName: parsedUser.displayName || parsedUser.username,
          email: parsedUser.email || '',
          username: parsedUser.username
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const showMessage = (type: string, text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local storage
      const updatedUser = { ...user, ...profileForm };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      showMessage('success', 'Profile updated successfully!');
    } catch (error) {
      showMessage('error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMessage('error', 'New passwords do not match.');
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      showMessage('success', 'Password changed successfully!');
    } catch (error) {
      showMessage('error', 'Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferencesSave = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      
      showMessage('success', 'Preferences saved successfully!');
    } catch (error) {
      showMessage('error', 'Failed to save preferences.');
    } finally {
      setIsLoading(false);
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Settings</h1>
        <p style={styles.subtitle}>Manage your account settings and preferences</p>
      </div>

      {message.text && (
        <div style={{
          ...styles.message,
          backgroundColor: message.type === 'success' ? 'rgba(39, 174, 96, 0.1)' : 'rgba(231, 76, 60, 0.1)',
          borderColor: message.type === 'success' ? 'rgba(39, 174, 96, 0.2)' : 'rgba(231, 76, 60, 0.2)',
          color: message.type === 'success' ? '#27ae60' : '#e74c3c'
        }}>
          {message.type === 'success' ? '✓' : '⚠'} {message.text}
        </div>
      )}

      <div style={styles.content}>
        {/* Sidebar Navigation */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarSection}>
            <h3 style={styles.sidebarTitle}>Account</h3>
            <nav style={styles.sidebarNav}>
              <button
                onClick={() => setActiveTab('profile')}
                style={{
                  ...styles.sidebarButton,
                  ...(activeTab === 'profile' ? styles.sidebarButtonActive : {})
                }}
              >
                👤 Profile
              </button>
              <button
                onClick={() => setActiveTab('security')}
                style={{
                  ...styles.sidebarButton,
                  ...(activeTab === 'security' ? styles.sidebarButtonActive : {})
                }}
              >
                🔒 Security
              </button>
              <button
                onClick={() => setActiveTab('preferences')}
                style={{
                  ...styles.sidebarButton,
                  ...(activeTab === 'preferences' ? styles.sidebarButtonActive : {})
                }}
              >
                ⚙️ Preferences
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                style={{
                  ...styles.sidebarButton,
                  ...(activeTab === 'notifications' ? styles.sidebarButtonActive : {})
                }}
              >
                🔔 Notifications
              </button>
            </nav>
          </div>

          <div style={styles.sidebarSection}>
            <h3 style={styles.sidebarTitle}>System</h3>
            <nav style={styles.sidebarNav}>
              <button
                onClick={() => setActiveTab('about')}
                style={{
                  ...styles.sidebarButton,
                  ...(activeTab === 'about' ? styles.sidebarButtonActive : {})
                }}
              >
                ℹ️ About
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div style={styles.tabContent}>
              <h2 style={styles.tabTitle}>Profile Settings</h2>
              <p style={styles.tabDescription}>
                Update your personal information and how others see you in the system.
              </p>

              <div style={styles.profileHeader}>
                <div style={styles.avatarSection}>
                  <div style={styles.avatar}>
                    {user?.displayName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 style={styles.userName}>{user?.displayName || user?.username}</h3>
                    <div style={styles.userDetails}>
                      <span style={{
                        ...styles.roleBadge,
                        backgroundColor: getRoleBadgeColor(user?.role || '')
                      }}>
                        {user?.role?.replace('_', ' ') || 'User'}
                      </span>
                      <span style={styles.userId}>ID: {user?.id}</span>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Display Name</label>
                  <input
                    type="text"
                    value={profileForm.displayName}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, displayName: e.target.value }))}
                    style={styles.input}
                    placeholder="Enter your display name"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Username</label>
                  <input
                    type="text"
                    value={profileForm.username}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, username: e.target.value }))}
                    style={styles.input}
                    placeholder="Enter your username"
                    disabled
                  />
                  <small style={styles.helpText}>Username cannot be changed</small>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Email Address</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                    style={styles.input}
                    placeholder="Enter your email address"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={styles.saveButton}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div style={styles.tabContent}>
              <h2 style={styles.tabTitle}>Security Settings</h2>
              <p style={styles.tabDescription}>
                Manage your password and account security.
              </p>

              <form onSubmit={handlePasswordChange} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Current Password</label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    style={styles.input}
                    placeholder="Enter current password"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>New Password</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    style={styles.input}
                    placeholder="Enter new password"
                    required
                    minLength={6}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    style={styles.input}
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={styles.saveButton}
                >
                  {isLoading ? 'Updating...' : 'Change Password'}
                </button>
              </form>

              <div style={styles.securitySection}>
                <h3 style={styles.sectionTitle}>Session Management</h3>
                <div style={styles.sessionInfo}>
                  <p>Current session started: {new Date().toLocaleString()}</p>
                  <button style={styles.secondaryButton}>
                    Logout All Other Sessions
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div style={styles.tabContent}>
              <h2 style={styles.tabTitle}>Preferences</h2>
              <p style={styles.tabDescription}>
                Customize your experience with the application.
              </p>

              <div style={styles.preferencesGrid}>
                <div style={styles.preferenceItem}>
                  <label style={styles.preferenceLabel}>Theme</label>
                  <select
                    value={preferences.theme}
                    onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value }))}
                    style={styles.select}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>

                <div style={styles.preferenceItem}>
                  <label style={styles.preferenceLabel}>Language</label>
                  <select
                    value={preferences.language}
                    onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                    style={styles.select}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handlePreferencesSave}
                disabled={isLoading}
                style={styles.saveButton}
              >
                {isLoading ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div style={styles.tabContent}>
              <h2 style={styles.tabTitle}>Notification Settings</h2>
              <p style={styles.tabDescription}>
                Control how and when you receive notifications.
              </p>

              <div style={styles.notificationSettings}>
                <div style={styles.settingItem}>
                  <div>
                    <h4 style={styles.settingTitle}>Email Notifications</h4>
                    <p style={styles.settingDescription}>
                      Receive notifications via email
                    </p>
                  </div>
                  <label style={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={preferences.emailNotifications}
                      onChange={(e) => setPreferences(prev => ({ ...prev, emailNotifications: e.target.checked }))}
                    />
                    <span style={styles.toggleSlider}></span>
                  </label>
                </div>

                <div style={styles.settingItem}>
                  <div>
                    <h4 style={styles.settingTitle}>Push Notifications</h4>
                    <p style={styles.settingDescription}>
                      Receive browser push notifications
                    </p>
                  </div>
                  <label style={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={preferences.pushNotifications}
                      onChange={(e) => setPreferences(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                    />
                    <span style={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>

              <button
                onClick={handlePreferencesSave}
                disabled={isLoading}
                style={styles.saveButton}
              >
                {isLoading ? 'Saving...' : 'Save Notification Settings'}
              </button>
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div style={styles.tabContent}>
              <h2 style={styles.tabTitle}>About Nucleus</h2>
              <p style={styles.tabDescription}>
                Version information and system details.
              </p>

              <div style={styles.aboutSection}>
                <div style={styles.aboutCard}>
                  <h3 style={styles.aboutTitle}>System Information</h3>
                  <div style={styles.aboutList}>
                    <div style={styles.aboutItem}>
                      <span style={styles.aboutLabel}>Version:</span>
                      <span style={styles.aboutValue}>1.0.0</span>
                    </div>
                    <div style={styles.aboutItem}>
                      <span style={styles.aboutLabel}>Build Date:</span>
                      <span style={styles.aboutValue}>{new Date().toLocaleDateString()}</span>
                    </div>
                    <div style={styles.aboutItem}>
                      <span style={styles.aboutLabel}>Environment:</span>
                      <span style={styles.aboutValue}>Production</span>
                    </div>
                  </div>
                </div>

                <div style={styles.aboutCard}>
                  <h3 style={styles.aboutTitle}>Support</h3>
                  <p style={styles.aboutText}>
                    For support and assistance, please contact your system administrator
                    or visit the help section.
                  </p>
                  <button
                    onClick={() => navigate('/help')}
                    style={styles.secondaryButton}
                  >
                    Visit Help Center
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  } as React.CSSProperties,

  header: {
    marginBottom: '2rem',
  } as React.CSSProperties,

  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#2c3e50',
    margin: '0 0 0.5rem 0',
  } as React.CSSProperties,

  subtitle: {
    fontSize: '1.1rem',
    color: '#7f8c8d',
    margin: 0,
  } as React.CSSProperties,

  message: {
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    border: '1px solid',
    fontWeight: '500',
  } as React.CSSProperties,

  content: {
    display: 'grid',
    gridTemplateColumns: '250px 1fr',
    gap: '2rem',
    alignItems: 'start',
  } as React.CSSProperties,

  sidebar: {
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: '1.5rem',
    border: '1px solid #e1e8ed',
  } as React.CSSProperties,

  sidebarSection: {
    marginBottom: '2rem',
  } as React.CSSProperties,

  sidebarTitle: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#7f8c8d',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: '0 0 1rem 0',
  } as React.CSSProperties,

  sidebarNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  } as React.CSSProperties,

  sidebarButton: {
    padding: '0.75rem 1rem',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    color: '#2c3e50',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '0.95rem',
    transition: 'all 0.2s',
  } as React.CSSProperties,

  sidebarButtonActive: {
    backgroundColor: '#3498db',
    color: 'white',
    fontWeight: '600',
  } as React.CSSProperties,

  mainContent: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    border: '1px solid #e1e8ed',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  } as React.CSSProperties,

  tabContent: {
    animation: 'fadeIn 0.3s ease-in',
  } as React.CSSProperties,

  tabTitle: {
    fontSize: '1.75rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: '0 0 0.5rem 0',
  } as React.CSSProperties,

  tabDescription: {
    color: '#7f8c8d',
    fontSize: '1rem',
    margin: '0 0 2rem 0',
    lineHeight: '1.5',
  } as React.CSSProperties,

  profileHeader: {
    marginBottom: '2rem',
    paddingBottom: '2rem',
    borderBottom: '1px solid #ecf0f1',
  } as React.CSSProperties,

  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  } as React.CSSProperties,

  avatar: {
    width: '64px',
    height: '64px',
    backgroundColor: '#3498db',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    color: 'white',
    background: 'linear-gradient(135deg, #3498db, #9b59b6)',
  } as React.CSSProperties,

  userName: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: '0 0 0.5rem 0',
  } as React.CSSProperties,

  userDetails: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  } as React.CSSProperties,

  roleBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: 'white',
  } as React.CSSProperties,

  userId: {
    fontSize: '0.8rem',
    color: '#7f8c8d',
  } as React.CSSProperties,

  form: {
    maxWidth: '500px',
  } as React.CSSProperties,

  formGroup: {
    marginBottom: '1.5rem',
  } as React.CSSProperties,

  label: {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '0.5rem',
  } as React.CSSProperties,

  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '2px solid #e1e8ed',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'all 0.2s',
    boxSizing: 'border-box',
  } as React.CSSProperties,

  helpText: {
    fontSize: '0.8rem',
    color: '#7f8c8d',
    marginTop: '0.25rem',
    display: 'block',
  } as React.CSSProperties,

  saveButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.75rem 2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  } as React.CSSProperties,

  secondaryButton: {
    backgroundColor: 'transparent',
    color: '#3498db',
    border: '2px solid #3498db',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  } as React.CSSProperties,

  securitySection: {
    marginTop: '2rem',
    paddingTop: '2rem',
    borderTop: '1px solid #ecf0f1',
  } as React.CSSProperties,

  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: '0 0 1rem 0',
  } as React.CSSProperties,

  sessionInfo: {
    backgroundColor: '#f8f9fa',
    padding: '1rem',
    borderRadius: '8px',
  } as React.CSSProperties,

  preferencesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  } as React.CSSProperties,

  preferenceItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  } as React.CSSProperties,

  preferenceLabel: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: '#2c3e50',
  } as React.CSSProperties,

  select: {
    padding: '0.75rem 1rem',
    border: '2px solid #e1e8ed',
    borderRadius: '8px',
    fontSize: '1rem',
    backgroundColor: 'white',
    cursor: 'pointer',
  } as React.CSSProperties,

  notificationSettings: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginBottom: '2rem',
  } as React.CSSProperties,

  settingItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e1e8ed',
  } as React.CSSProperties,

  settingTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: '0 0 0.25rem 0',
  } as React.CSSProperties,

  settingDescription: {
    fontSize: '0.9rem',
    color: '#7f8c8d',
    margin: 0,
  } as React.CSSProperties,

  toggle: {
    position: 'relative',
    display: 'inline-block',
    width: '50px',
    height: '24px',
  } as React.CSSProperties,

  toggleSlider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#bdc3c7',
    transition: '0.4s',
    borderRadius: '24px',
  } as React.CSSProperties,

  aboutSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  } as React.CSSProperties,

  aboutCard: {
    backgroundColor: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #e1e8ed',
  } as React.CSSProperties,

  aboutTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: '0 0 1rem 0',
  } as React.CSSProperties,

  aboutList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  } as React.CSSProperties,

  aboutItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #e1e8ed',
  } as React.CSSProperties,

  aboutLabel: {
    fontWeight: '600',
    color: '#2c3e50',
  } as React.CSSProperties,

  aboutValue: {
    color: '#7f8c8d',
  } as React.CSSProperties,

  aboutText: {
    color: '#7f8c8d',
    lineHeight: '1.5',
    margin: '0 0 1rem 0',
  } as React.CSSProperties,
};

export default SettingsPage;