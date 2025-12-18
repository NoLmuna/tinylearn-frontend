import { createContext, useContext, useMemo, useState } from 'react';

/**
 * Admin/Auth context
 * Holds authenticated user and role for the whole app.
 */

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('userRole') ?? null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') ?? null;
  });

  const login = (payload) => {
    const { user: nextUser, role: nextRole, token: nextToken } = payload;
    if (nextUser) {
      localStorage.setItem('user', JSON.stringify(nextUser));
    }
    if (nextRole) {
      localStorage.setItem('userRole', nextRole);
    }
    if (nextToken) {
      localStorage.setItem('token', nextToken);
    }
    setUser(nextUser ?? null);
    setRole(nextRole ?? null);
    setToken(nextToken ?? null);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    setUser(null);
    setRole(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      role,
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [user, role, token],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return ctx;
}

export default AdminContext;

