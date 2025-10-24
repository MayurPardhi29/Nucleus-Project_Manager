export interface UserProfile {
    id: number;
    username: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    bio?: string;
    phone?: string;
    department?: string;
  }
  
  export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
  
  export interface NotificationSettings {
    emailNotifications: boolean;
    pushNotifications: boolean;
    projectUpdates: boolean;
    issueAssignments: boolean;
    deadlineReminders: boolean;
    weeklyDigest: boolean;
  }
  
  export interface AppPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
    dateFormat: string;
    itemsPerPage: number;
    autoRefresh: boolean;
  }
  
  export interface SecuritySettings {
    twoFactorAuth: boolean;
    sessionTimeout: number;
    loginAlerts: boolean;
  }