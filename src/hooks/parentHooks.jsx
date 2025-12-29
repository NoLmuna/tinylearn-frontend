import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../config/axios';
import { useAdmin } from '../contexts/adminContext';
import { parentRegisterSchema, parentLoginSchema } from '../schema/parentSchema';

// Register parent hook
export function useRegisterParent() {
  const { login } = useAdmin();

  return useMutation({
    mutationKey: ['parent-register'],
    mutationFn: async (rawData) => {
      const data = parentRegisterSchema.parse(rawData);

      // Backend: POST /api/parents/register
      const response = await api.post('/parents/register', data);
      return response.data;
    },
    onSuccess: (data) => {
      // Backend returns: { success: true, data: { id, firstName, lastName, email, phoneNumber, role }, message }
      if (data?.data) {
        const payload = {
          user: {
            id: data.data.id,
            firstName: data.data.firstName,
            lastName: data.data.lastName,
            email: data.data.email,
          },
          role: 'parent',
          token: null, // Token will be set after login
        };

        // Note: Registration doesn't automatically log in, user needs to login separately
        // If you want auto-login, you'd need to call login endpoint here
      }
    },
  });
}

// Parent login hook
export function useParentLogin() {
  const { login } = useAdmin();

  return useMutation({
    mutationKey: ['parent-login'],
    mutationFn: async (rawData) => {
      const data = parentLoginSchema.parse(rawData);

      // Backend: POST /api/parents/login
      const response = await api.post('/parents/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      // Backend returns: { success: true, data: { user: {...}, token }, message }
      if (data?.data) {
        const payload = {
          token: data.data.token,
          role: 'parent',
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

// Get parent profile hook
export function useParentProfile() {
  return useQuery({
    queryKey: ['parent-profile'],
    queryFn: async () => {
      const response = await api.get('/parents/profile');
      return response.data;
    },
  });
}

// Get parent by ID hook
export function useParentById(parentId) {
  return useQuery({
    queryKey: ['parent', parentId],
    queryFn: async () => {
      const response = await api.get(`/parents/${parentId}`);
      return response.data;
    },
    enabled: !!parentId,
  });
}

// Update parent profile hook
export function useUpdateParent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['parent-update'],
    mutationFn: async ({ parentId, data }) => {
      const response = await api.put(`/parents/${parentId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parent-profile'] });
    },
  });
}

