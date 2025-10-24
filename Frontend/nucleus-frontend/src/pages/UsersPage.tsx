// pages/UsersPage.tsx
import React, { useState, useEffect } from 'react';
import { api } from '../api/axiosClient';
import type { User, UserCreateRequest, UserUpdateRequest, UserRole } from '../types/User';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  const [formData, setFormData] = useState<UserCreateRequest>({
    username: '',
    email: '',
    password: '',
    displayName: '',
    role: 'DEVELOPER'
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('🔄 Fetching users...');
      const response = await api.users.getAll();
      console.log('📦 Users API response:', response);
      
      if (response.data.status === 'success' && response.data.data) {
        setUsers(response.data.data);
      } else {
        console.error('Failed to fetch users:', response.data.message);
        setUsers([]);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!editingUser && !formData.password) {
      errors.password = 'Password is required';
    } else if (!editingUser && formData.password && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.displayName.trim()) {
      errors.displayName = 'Display name is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    console.log('🔄 Creating user with data:', formData);

    try {
      const response = await api.users.create(formData);
      console.log('📦 Create user response:', response);
      
      if (response.data.status === 'success') {
        setShowCreateForm(false);
        setFormData({
          username: '',
          email: '',
          password: '',
          displayName: '',
          role: 'DEVELOPER'
        });
        setFormErrors({});
        await fetchUsers();
        alert('User created successfully!');
      } else {
        alert(`Failed to create user: ${response.data.message}`);
      }
    } catch (error: any) {
      console.error('Error creating user:', error);
      alert(`Error: ${error.response?.data?.message || 'Failed to create user'}`);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!validateForm()) return;

    console.log('🔄 Updating user:', editingUser.id, 'with data:', formData);

    try {
      const updateData: UserUpdateRequest = {
        username: formData.username,
        email: formData.email,
        displayName: formData.displayName,
        role: formData.role
      };
      
      const response = await api.users.update(editingUser.id, updateData);
      console.log('📦 Update user response:', response);
      
      if (response.data.status === 'success') {
        setEditingUser(null);
        setFormData({
          username: '',
          email: '',
          password: '',
          displayName: '',
          role: 'DEVELOPER'
        });
        setFormErrors({});
        await fetchUsers();
        alert('User updated successfully!');
      } else {
        alert(`Failed to update user: ${response.data.message}`);
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
      alert(`Error: ${error.response?.data?.message || 'Failed to update user'}`);
    }
  };

  const handleDelete = async (id: number) => {
    console.log('🔄 Deleting user:', id);

    try {
      const response = await api.users.delete(id);
      console.log('📦 Delete user response:', response);
      
      if (response.data.status === 'success') {
        setDeleteConfirm(null);
        await fetchUsers();
        alert('User deleted successfully!');
      } else {
        alert(`Failed to delete user: ${response.data.message}`);
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      alert(`Error: ${error.response?.data?.message || 'Failed to delete user'}`);
    }
  };

  const startEdit = (user: User) => {
    console.log('✏️ Editing user:', user);
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: '', // Don't pre-fill password for security
      displayName: user.displayName,
      role: user.role
    });
    setFormErrors({});
  };

  const handleStatusToggle = async (userId: number, currentStatus: boolean) => {
    try {
      const response = await api.users.update(userId, { isActive: !currentStatus });
      if (response.data.status === 'success') {
        await fetchUsers();
        alert(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
      } else {
        alert(`Failed to update user status: ${response.data.message}`);
      }
    } catch (error: any) {
      console.error('Error updating user status:', error);
      alert(`Error: ${error.response?.data?.message || 'Failed to update user status'}`);
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || 
                         (statusFilter === 'ACTIVE' && user.isActive) ||
                         (statusFilter === 'INACTIVE' && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN': return '#e74c3c';
      case 'ORG_ADMIN': return '#3498db';
      case 'PROJECT_ADMIN': return '#9b59b6';
      case 'DEVELOPER': return '#27ae60';
      case 'VIEWER': return '#f39c12';
      default: return '#95a5a6';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'SUPER_ADMIN': return '👑';
      case 'ORG_ADMIN': return '⚡';
      case 'PROJECT_ADMIN': return '🔧';
      case 'DEVELOPER': return '💻';
      case 'VIEWER': return '👀';
      default: return '👤';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
          <p>Loading users...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
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
              Users ({filteredUsers.length})
            </h1>
            <p style={{ 
              margin: 0, 
              color: '#7f8c8d',
              fontSize: '1.1rem'
            }}>
              Manage team members and their permissions
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
              gap: '0.5rem'
            }}
          >
            <span>👤</span>
            Add User
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
              placeholder="Search users..."
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

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as UserRole | 'ALL')}
            style={{
              padding: '0.75rem',
              border: '1px solid #bdc3c7',
              borderRadius: '6px',
              fontSize: '1rem',
              minWidth: '140px'
            }}
          >
            <option value="ALL">All Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ORG_ADMIN">Org Admin</option>
            <option value="PROJECT_ADMIN">Project Admin</option>
            <option value="DEVELOPER">Developer</option>
            <option value="VIEWER">Viewer</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE')}
            style={{
              padding: '0.75rem',
              border: '1px solid #bdc3c7',
              borderRadius: '6px',
              fontSize: '1rem',
              minWidth: '140px'
            }}
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👥</div>
          <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>
            {users.length === 0 ? 'No users yet' : 'No users found'}
          </h3>
          <p style={{ color: '#7f8c8d', marginBottom: '2rem' }}>
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first team member'}
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
            Add User
          </button>
        </div>
      ) : (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr auto',
            gap: '1rem',
            padding: '1rem 1.5rem',
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #ecf0f1',
            fontWeight: '600',
            color: '#2c3e50',
            fontSize: '0.9rem'
          }}>
            <div>User</div>
            <div>Contact</div>
            <div>Role</div>
            <div>Status</div>
            <div>Last Login</div>
            <div>Actions</div>
          </div>

          {filteredUsers.map((user, index) => (
            <UserListItem 
              key={user.id}
              user={user}
              onEdit={startEdit}
              onDelete={setDeleteConfirm}
              onStatusToggle={handleStatusToggle}
              getRoleColor={getRoleColor}
              getRoleIcon={getRoleIcon}
              formatDate={formatDate}
              isLast={index === filteredUsers.length - 1}
            />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(showCreateForm || editingUser) && (
        <UserModal
          mode={editingUser ? 'edit' : 'create'}
          user={editingUser}
          formData={formData}
          formErrors={formErrors}
          onFormDataChange={setFormData}
          onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
          onClose={() => {
            setShowCreateForm(false);
            setEditingUser(null);
            setFormData({
              username: '',
              email: '',
              password: '',
              displayName: '',
              role: 'DEVELOPER'
            });
            setFormErrors({});
          }}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <DeleteConfirmation
          user={users.find(u => u.id === deleteConfirm)}
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
};

// User List Item Component
const UserListItem: React.FC<{
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  onStatusToggle: (userId: number, currentStatus: boolean) => void;
  getRoleColor: (role: UserRole) => string;
  getRoleIcon: (role: UserRole) => string;
  formatDate: (dateString: string) => string;
  isLast: boolean;
}> = ({ user, onEdit, onDelete, onStatusToggle, getRoleColor, getRoleIcon, formatDate, isLast }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div 
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr auto',
        gap: '1rem',
        padding: '1rem 1.5rem',
        borderBottom: isLast ? 'none' : '1px solid #ecf0f1',
        alignItems: 'center',
        transition: 'background-color 0.2s',
        position: 'relative'
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* User Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          backgroundColor: getRoleColor(user.role),
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1rem'
        }}>
          {user.displayName?.charAt(0) || user.username.charAt(0)}
        </div>
        <div>
          <div style={{ fontWeight: '600', color: '#2c3e50' }}>
            {user.displayName}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>
            @{user.username}
          </div>
        </div>
      </div>

      {/* Contact */}
      <div>
        <div style={{ color: '#2c3e50', marginBottom: '0.25rem' }}>
          {user.email}
        </div>
        <div style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>
          Joined {formatDate(user.createdAt)}
        </div>
      </div>

      {/* Role */}
      <div>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          padding: '0.25rem 0.5rem',
          backgroundColor: getRoleColor(user.role) + '20',
          color: getRoleColor(user.role),
          borderRadius: '12px',
          fontSize: '0.8rem',
          fontWeight: '500'
        }}>
          {getRoleIcon(user.role)} {user.role.replace('_', ' ')}
        </span>
      </div>

      {/* Status */}
      <div>
        <button
          onClick={() => onStatusToggle(user.id, user.isActive)}
          style={{
            padding: '0.25rem 0.75rem',
            backgroundColor: user.isActive ? '#27ae60' : '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '0.8rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          {user.isActive ? 'Active' : 'Inactive'}
        </button>
      </div>

      {/* Last Login */}
      <div style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>
        {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        {showActions && (
          <>
            <ActionButton icon="✏️" onClick={() => onEdit(user)} />
            <ActionButton icon="🗑️" onClick={() => onDelete(user.id)} color="#e74c3c" />
          </>
        )}
      </div>
    </div>
  );
};

// Action Button Component
const ActionButton: React.FC<{
  icon: string;
  onClick: () => void;
  color?: string;
}> = ({ icon, onClick, color }) => (
  <button
    onClick={onClick}
    style={{
      padding: '0.5rem',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      color: color || '#7f8c8d',
      borderRadius: '4px',
      transition: 'background-color 0.2s'
    }}
    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
  >
    {icon}
  </button>
);

// User Modal Component
const UserModal: React.FC<{
  mode: 'create' | 'edit';
  user?: User | null;
  formData: UserCreateRequest;
  formErrors: { [key: string]: string };
  onFormDataChange: (data: UserCreateRequest) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}> = ({ mode, user, formData, formErrors, onFormDataChange, onSubmit, onClose }) => (
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
        {mode === 'create' ? 'Add New User' : 'Edit User'}
      </h2>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem',
          fontWeight: '500',
          color: '#2c3e50'
        }}>
          Username *
        </label>
        <input
          type="text"
          value={formData.username}
          onChange={(e) => onFormDataChange({ ...formData, username: e.target.value })}
          required
          placeholder="Enter username"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: formErrors.username ? '1px solid #e74c3c' : '1px solid #bdc3c7',
            borderRadius: '6px',
            fontSize: '1rem'
          }}
        />
        {formErrors.username && (
          <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
            {formErrors.username}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem',
          fontWeight: '500',
          color: '#2c3e50'
        }}>
          Email *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => onFormDataChange({ ...formData, email: e.target.value })}
          required
          placeholder="Enter email address"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: formErrors.email ? '1px solid #e74c3c' : '1px solid #bdc3c7',
            borderRadius: '6px',
            fontSize: '1rem'
          }}
        />
        {formErrors.email && (
          <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
            {formErrors.email}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem',
          fontWeight: '500',
          color: '#2c3e50'
        }}>
          Display Name *
        </label>
        <input
          type="text"
          value={formData.displayName}
          onChange={(e) => onFormDataChange({ ...formData, displayName: e.target.value })}
          required
          placeholder="Enter display name"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: formErrors.displayName ? '1px solid #e74c3c' : '1px solid #bdc3c7',
            borderRadius: '6px',
            fontSize: '1rem'
          }}
        />
        {formErrors.displayName && (
          <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
            {formErrors.displayName}
          </div>
        )}
      </div>

      {mode === 'create' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '0.5rem',
            fontWeight: '500',
            color: '#2c3e50'
          }}>
            Password *
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => onFormDataChange({ ...formData, password: e.target.value })}
            required
            placeholder="Enter password"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: formErrors.password ? '1px solid #e74c3c' : '1px solid #bdc3c7',
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          />
          {formErrors.password && (
            <div style={{ color: '#e74c3c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
              {formErrors.password}
            </div>
          )}
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '0.5rem',
          fontWeight: '500',
          color: '#2c3e50'
        }}>
          Role *
        </label>
        <select
          value={formData.role}
          onChange={(e) => onFormDataChange({ ...formData, role: e.target.value as UserRole })}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #bdc3c7',
            borderRadius: '6px',
            fontSize: '1rem'
          }}
        >
          <option value="VIEWER">Viewer</option>
          <option value="DEVELOPER">Developer</option>
          <option value="PROJECT_ADMIN">Project Admin</option>
          <option value="ORG_ADMIN">Organization Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
        </select>
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
          {mode === 'create' ? 'Create User' : 'Save Changes'}
        </button>
      </div>
    </form>
  </div>
);

// Delete Confirmation Component
const DeleteConfirmation: React.FC<{
  user?: User;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ user, onConfirm, onCancel }) => (
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
        Delete User
      </h3>
      <p style={{ color: '#7f8c8d', marginBottom: '2rem' }}>
        Are you sure you want to delete <strong>"{user?.displayName}"</strong>? This action cannot be undone.
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
          Delete User
        </button>
      </div>
    </div>
  </div>
);

export default UsersPage;