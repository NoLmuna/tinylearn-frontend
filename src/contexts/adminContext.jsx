/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import api from "../config/axios";

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
    return parts.pop().split(";").shift();
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
  const queryClient = useQueryClient();

  const [user, setUser] = useState(() => {
    const stored = getCookie("user");
    return stored ? JSON.parse(decodeURIComponent(stored)) : null;
  });

  const [role, setRole] = useState(() => {
    return getCookie("userRole") ?? null;
  });

  const login = useCallback((payload) => {
    // Clear any cached queries from a previous user's session
    queryClient.clear();
    const { user: nextUser, role: nextRole } = payload;
    if (nextUser) {
      setCookie("user", encodeURIComponent(JSON.stringify(nextUser)));
    }
    if (nextRole) {
      setCookie("userRole", nextRole);
    }
    setUser(nextUser ?? null);
    setRole(nextRole ?? null);
  }, [queryClient]);

  const logout = useCallback(async () => {
    try {
      await api.post("/users/logout");
    } catch (_) {
      // proceed with local cleanup even if the server call fails
    }
    deleteCookie("user");
    deleteCookie("userRole");
    // Clear all cached queries so the next user starts with a clean slate
    queryClient.clear();
    setUser(null);
    setRole(null);
    toast.success("You have been logged out.");
  }, [queryClient]);

  const value = useMemo(
    () => ({
      user,
      role,
      isAuthenticated: Boolean(user && role),
      login,
      logout,
    }),
    [user, role, login, logout],
  );

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return ctx;
}

export default AdminContext;




