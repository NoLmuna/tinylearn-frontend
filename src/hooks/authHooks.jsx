import { useMutation } from '@tanstack/react-query';
import api from '../config/axios';
import { useAdmin } from '../contexts/adminContext';
import { loginSchema } from '../schema/authSchema';

/**
 * Login hook for Students, Parents, and Teachers
 * Uses /users/login endpoint which checks Teacher, Parent, and Student models
 */
export function useLogin() {
  const { login } = useAdmin();

  return useMutation({
    mutationKey: ['user-login'],
    mutationFn: async (rawData) => {
      const validatedData = loginSchema.parse(rawData);
      const response = await api.post('/users/login', validatedData);
      return response.data;
    },
    onSuccess: (data) => {
      // Backend returns: { success: true, data: { id, firstName, lastName, email, role, accountStatus, ... }, message }
      // Token is set in HTTP-only cookie by backend, so we don't need to handle it here
      if (data?.data) {
        const payload = {
          token: null, // Token is in HTTP-only cookie, not accessible via JS
          role: data.data.role,
          user: {
            id: data.data.id,
            firstName: data.data.firstName,
            lastName: data.data.lastName,
            email: data.data.email,
          },
        };

        // Update context (which handles user/role cookies)
        // Token cookie is already set by backend
        login(payload);
      }
    },
  });
}