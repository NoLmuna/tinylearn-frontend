import { createContext } from 'react';

// Create context with default values
export const AuthContext = createContext({
  user: null,
  loading: false,
  login: async () => {},
  logout: () => {},
  updateProfile: async () => {},
  getRoleDashboardPath: () => '/dashboard',
  isAuthenticated: false
});
