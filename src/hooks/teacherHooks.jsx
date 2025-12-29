import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../config/axios';
import { useAdmin } from '../contexts/adminContext';
import { teacherRegisterSchema, teacherLoginSchema } from '../schema/teacherSchema';

// Register teacher hook
export function useRegisterTeacher() {
  const { login } = useAdmin();

  return useMutation({
    mutationKey: ['teacher-register'],
    mutationFn: async (rawData) => {
      const data = teacherRegisterSchema.parse(rawData);

      // Backend: POST /api/teachers/register
      const response = await api.post('/teachers/register', data);
      return response.data;
    },
    onSuccess: (data) => {
      // Backend returns: { success: true, data: { id, firstName, lastName, email, accountStatus }, message }
      if (data?.data) {
        const payload = {
          user: {
            id: data.data.id,
            firstName: data.data.firstName,
            lastName: data.data.lastName,
            email: data.data.email,
          },
          role: 'teacher',
          token: null, // Token will be set after login
        };

        // Note: Registration doesn't automatically log in, user needs to login separately
        // If you want auto-login, you'd need to call login endpoint here
      }
    },
  });
}

// Teacher login hook
export function useTeacherLogin() {
  const { login } = useAdmin();

  return useMutation({
    mutationKey: ['teacher-login'],
    mutationFn: async (rawData) => {
      const data = teacherLoginSchema.parse(rawData);

      // Backend: POST /api/teachers/login
      const response = await api.post('/teachers/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      // Backend returns: { success: true, data: { user: {...}, token }, message }
      if (data?.data) {
        const payload = {
          token: data.data.token,
          role: 'teacher',
          user: {
            id: data.data.user.id,
            firstName: data.data.user.firstName,
            lastName: data.data.user.lastName,
            email: data.data.user.email,
          },
        };

        login(payload);
      }
    },
  });
}

// Get teacher profile hook
export function useTeacherProfile() {
  return useQuery({
    queryKey: ['teacher-profile'],
    queryFn: async () => {
      const response = await api.get('/teachers/profile');
      return response.data;
    },
  });
}

// Get teacher by ID hook
export function useTeacherById(teacherId) {
  return useQuery({
    queryKey: ['teacher', teacherId],
    queryFn: async () => {
      const response = await api.get(`/teachers/${teacherId}`);
      return response.data;
    },
    enabled: !!teacherId,
  });
}

// Update teacher profile hook
export function useUpdateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['teacher-update'],
    mutationFn: async ({ teacherId, data }) => {
      const response = await api.put(`/teachers/${teacherId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-profile'] });
    },
  });
}

// Create student hook (teacher creates student)
export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['teacher-create-student'],
    mutationFn: async (rawData) => {
      // Backend: POST /api/teachers/students
      const response = await api.post('/teachers/students', rawData);
      return response.data;
    },
    onSuccess: () => {
      // Refresh assigned students list
      queryClient.invalidateQueries({ queryKey: ['assigned-students'] });
    },
  });
}

// Create parent hook (teacher creates parent)
export function useCreateParent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['teacher-create-parent'],
    mutationFn: async (rawData) => {
      // Backend: POST /api/teachers/parents
      const response = await api.post('/teachers/parents', rawData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assigned-students'] });
    },
  });
}

// Get assigned students hook
export function useAssignedStudents() {
  return useQuery({
    queryKey: ['assigned-students'],
    queryFn: async () => {
      const response = await api.get('/teachers/students');
      return response.data;
    },
  });
}

