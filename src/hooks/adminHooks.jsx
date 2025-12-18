import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../config/axios';
import { useAdmin } from '../contexts/adminContext';
import { adminLoginSchema, adminCreateTeacherSchema } from '../schema/adminSchema.jsx';

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
    mutationKey: ['login'],
    mutationFn: async (rawData) => {
      const data = adminLoginSchema.parse(rawData);

      const response = await api.post('/auth/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      const payload = {
        token: data.token,
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
    mutationKey: ['admin-login'],
    mutationFn: async (rawData) => {
      const data = adminLoginSchema.parse(rawData);

      const response = await api.post('/admins/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      const payload = {
        token: data.token,
        role: 'admin',
        user: data.user,
      };

      login(payload);
    },
  });
}

// Create teacher as admin
export function useCreateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['admin-create-teacher'],
    mutationFn: async (rawData) => {
      const data = adminCreateTeacherSchema.parse(rawData);

      // Backend: POST /api/admins/teachers (see AdminRoutes + AdminController.registerTeacher)
      const response = await api.post('/admins/teachers', data);
      return response.data;
    },
    onSuccess: () => {
      // Refresh teachers list after successful creation
      queryClient.invalidateQueries({ queryKey: ['admin-teachers'] });
    },
  });
}

// Fetch teachers list for admin
export function useAdminTeachers() {
  return useQuery({
    queryKey: ['admin-teachers'],
    queryFn: async () => {
      const response = await api.get('/admins/users/teachers');
      return response.data;
    },
  });
}
