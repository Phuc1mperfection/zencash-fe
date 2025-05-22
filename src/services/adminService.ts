/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api';

// Interface definitions for admin-related data
interface User {
  id: string;
  username: string;
  email: string;
  fullname?: string;
  roles: string[];
  active: boolean;
  avatar?: string;
  currency?: string;
}

// Admin service for user management
const adminService = {
  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  
  // Search users (new endpoint)
  searchUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get('/admin/users/search');
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },

  // Toggle user active status
  toggleUserStatus: async (userId: string, active: boolean): Promise<User> => {
    try {
      const response = await api.put(`/admin/users/${userId}/status`, { active });
      return response.data;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  },

    // Reset user password
  resetUserPassword: async (userId: string): Promise<{ message: string }> => {
    try {
      const response = await api.post(`/admin/reset-password?email=${encodeURIComponent(userId)}`);
      return response.data;
    } catch (error) {
      console.error('Error resetting user password:', error);
      throw error;
    }
  },

  // Get system settings
  getSettings: async (): Promise<any> => {
    try {
      const response = await api.get('/admin/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  },

  // Update system settings
  updateSettings: async (settings: any): Promise<any> => {
    try {
      const response = await api.put('/admin/settings', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }
};

export default adminService;
