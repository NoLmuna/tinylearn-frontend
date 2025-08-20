import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext.js';
import ApiService from '../services/api';
import toast from 'react-hot-toast';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('tinylearn_token');
      if (token) {
        try {
          const response = await ApiService.getProfile();
          if (response.success) {
            setUser(response.data);
          } else {
            // Invalid token, clear it
            localStorage.removeItem('tinylearn_token');
            localStorage.removeItem('tinylearn_user');
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('tinylearn_token');
          localStorage.removeItem('tinylearn_user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await ApiService.login(credentials);
      
      if (response.success) {
        const { user, token } = response.data;
        setUser(user);
        localStorage.setItem('tinylearn_token', token);
        localStorage.setItem('tinylearn_user', JSON.stringify(user));
        return { success: true, user };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tinylearn_token');
    localStorage.removeItem('tinylearn_user');
    localStorage.removeItem('tinylearn_email');
    localStorage.removeItem('tinylearn_role');
    toast.success('Logged out successfully');
  };

  const updateProfile = async (userData) => {
    try {
      const response = await ApiService.updateProfile(userData);
      
      if (response.success) {
        setUser(response.data);
        localStorage.setItem('tinylearn_user', JSON.stringify(response.data));
        return { success: true, user: response.data };
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const getRoleDashboardPath = (role) => {
    switch (role) {
      case 'student':
        return '/student';
      case 'teacher':
        return '/teacher';
      case 'parent':
        return '/parent';
      case 'admin':
        return '/admin';
      default:
        return '/';
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      updateProfile, 
      loading,
      getRoleDashboardPath
    }}>
      {children}
    </AuthContext.Provider>
  );
}
