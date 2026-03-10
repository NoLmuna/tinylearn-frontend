import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../config/axios";
import { useAdmin } from "../contexts/adminContext";
import {
  adminLoginSchema,
  adminCreateTeacherSchema,
} from "../schema/adminSchema.jsx";

// Shape of the expected login response from backend
// Adjust this to match your API.
// Example:
// {
//   token: string;
//   role: 'student' | 'parent' | 'teacher' | 'admin';
//   user: { id: number; name: string; email: string; }
// }

// Generic login hook (for main login if/when /auth/login exists)
export function useLogin() {
  const { login } = useAdmin();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (rawData) => {
      const data = adminLoginSchema.parse(rawData);

      const response = await api.post("/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      const payload = {
        role: data.role,
        user: data.user,
      };

      login(payload);
    },
  });
}

// Admin-specific login hook hitting /admins/login
export function useAdminLogin() {
  const { login } = useAdmin();

  return useMutation({
    mutationKey: ["admin-login"],
    mutationFn: async (rawData) => {
      const data = adminLoginSchema.parse(rawData);

      const response = await api.post("/admins/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      // Backend returns: { success: true, data: { user: {...} }, message: "..." }
      const payload = {
        role: "admin",
        user: data.data?.user,
      };

      login(payload);
      toast.success("Welcome back, Administrator!");
    },
  });
}

// User login hook for Students, Parents, and Teachers (hits /users/login)
export function useUserLogin() {
  const { login } = useAdmin();

  return useMutation({
    mutationKey: ["user-login"],
    mutationFn: async (rawData) => {
      const data = adminLoginSchema.parse(rawData);

      const response = await api.post("/users/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      // Backend returns: { success: true, data: { user: { id, firstName, lastName, email, role, ... } }, message }
      // Token is set as HttpOnly cookie by the server; no token in response body.
      const userData = data?.data?.user;
      if (userData) {
        const payload = {
          role: userData.role,
          user: {
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
          },
        };

        login(payload);
      }
    },
  });
}

// Create teacher as admin
export function useCreateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin-create-teacher"],
    mutationFn: async (rawData) => {
      const data = adminCreateTeacherSchema.parse(rawData);

      // Backend: POST /api/admins/teachers (see AdminRoutes + AdminController.registerTeacher)
      const response = await api.post("/admins/teachers", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-teachers"] });
      toast.success("Teacher account created successfully!");
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message || "Failed to create teacher account.";
      toast.error(msg);
    },
  });
}

// Fetch teachers list for admin
export function useAdminTeachers() {
  return useQuery({
    queryKey: ["admin-teachers"],
    queryFn: async () => {
      const response = await api.get("/admins/users/teachers");
      return response.data;
    },
  });
}

// Fetch students list for admin
export function useAdminStudents() {
  return useQuery({
    queryKey: ["admin-students"],
    queryFn: async () => {
      const response = await api.get("/admins/users/students");
      return response.data;
    },
  });
}

// Fetch parents list for admin
export function useAdminParents() {
  return useQuery({
    queryKey: ["admin-parents"],
    queryFn: async () => {
      const response = await api.get("/admins/users/parents");
      return response.data;
    },
  });
}

// Fetch system stats for admin
export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const response = await api.get("/admins/stats");
      return response.data;
    },
  });
}

// Create student as admin
export function useAdminCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin-create-student"],
    mutationFn: async (rawData) => {
      const response = await api.post("/admins/students", rawData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-students"] });
      toast.success("Student account created!");
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message || "Failed to create student account.";
      toast.error(msg);
    },
  });
}

// Create parent as admin
export function useAdminCreateParent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["admin-create-parent"],
    mutationFn: async (rawData) => {
      const response = await api.post("/admins/parents", rawData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-parents"] });
      toast.success("Parent account created!");
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message || "Failed to create parent account.";
      toast.error(msg);
    },
  });
}

// Reset any user's password as admin
export function useAdminResetPassword() {
  return useMutation({
    mutationKey: ["admin-reset-password"],
    mutationFn: async ({ role, userId, newPassword }) => {
      const response = await api.put(
        `/admins/users/${role}/${userId}/password`,
        { newPassword },
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Password reset successfully!");
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || "Failed to reset password.";
      toast.error(msg);
    },
  });
}
