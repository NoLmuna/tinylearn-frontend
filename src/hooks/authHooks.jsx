import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../config/axios";
import { useAdmin } from "../contexts/adminContext";
import { loginSchema } from "../schema/authSchema";

/**
 * Login hook for Students, Parents, and Teachers
 * Uses /users/login endpoint which checks Teacher, Parent, and Student models
 */
export function useLogin() {
  const { login } = useAdmin();

  return useMutation({
    mutationKey: ["user-login"],
    mutationFn: async (rawData) => {
      const validatedData = loginSchema.parse(rawData);
      const response = await api.post("/users/login", validatedData);
      return response.data;
    },
    onSuccess: (data) => {
      // Backend returns: { success: true, data: { user: { id, firstName, lastName, email, role, ... } }, message }
      // Token is set in HTTP-only cookie by backend, so we don't need to handle it here
      const userData = data?.data?.user;
      if (userData) {
        const payload = {
          token: null, // Token is in HTTP-only cookie, not accessible via JS
          role: userData.role,
          user: {
            id: userData.id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
          },
        };

        login(payload);
        const name = userData.firstName
          ? `Welcome back, ${userData.firstName}!`
          : "Login successful!";
        toast.success(name);
      }
    },
  });
}
