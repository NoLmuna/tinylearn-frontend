import { createContext, useContext, useMemo, useState } from 'react';

/**
 * Admin/Auth context
 * Holds authenticated user and role for the whole app.
 * Uses cookies instead of localStorage for better security and server-side compatibility.
 */

// Cookie helper functions
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift();
  }
  return null;
};

const setCookie = (name, value, days = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = getCookie('user');
    return stored ? JSON.parse(decodeURIComponent(stored)) : null;
  });

  const [role, setRole] = useState(() => {
    return getCookie('userRole') ?? null;
  });

  const [token, setToken] = useState(() => {
    return getCookie('token') ?? null;
  });

  const login = (payload) => {
    const { user: nextUser, role: nextRole, token: nextToken } = payload;
    if (nextUser) {
      setCookie('user', encodeURIComponent(JSON.stringify(nextUser)));
    }
    if (nextRole) {
      setCookie('userRole', nextRole);
    }
    if (nextToken) {
      setCookie('token', nextToken);
    }
    setUser(nextUser ?? null);
    setRole(nextRole ?? null);
    setToken(nextToken ?? null);
  };

  const logout = () => {
    deleteCookie('user');
    deleteCookie('userRole');
    deleteCookie('token');
    setUser(null);
    setRole(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      role,
      token, // May be null if token is HTTP-only cookie (set by backend)
      isAuthenticated: Boolean(user && role), // Check user/role instead of token since token may be HTTP-only
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

