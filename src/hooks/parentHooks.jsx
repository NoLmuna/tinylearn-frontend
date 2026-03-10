/* eslint-disable */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../config/axios";
import { useAdmin } from "../contexts/adminContext";
import {
  parentRegisterSchema,
  parentLoginSchema,
} from "../schema/parentSchema";

// Register parent hook
export function useRegisterParent() {
  const { login } = useAdmin();

  return useMutation({
    mutationKey: ["parent-register"],
    mutationFn: async (rawData) => {
      const data = parentRegisterSchema.parse(rawData);

      // Backend: POST /api/parents/register
      const response = await api.post("/parents/register", data);
      return response.data;
    },
    onSuccess: (data) => {
      // Backend returns: { success: true, data: { id, firstName, lastName, email, phoneNumber, role }, message }
      if (data?.data) {
        const _payload_remove = {
          user: {
            id: data.data.id,
            firstName: data.data.firstName,
            lastName: data.data.lastName,
            email: data.data.email,
          },
          role: "parent",
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
    mutationKey: ["parent-login"],
    mutationFn: async (rawData) => {
      const data = parentLoginSchema.parse(rawData);

      // Backend: POST /api/parents/login
      const response = await api.post("/parents/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      // Backend returns: { success: true, data: { user: {...} }, message }
      // Token is set as HttpOnly cookie by the server; no token in response body.
      if (data?.data) {
        const payload = {
          role: "parent",
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
    queryKey: ["parent-profile"],
    queryFn: async () => {
      const response = await api.get("/parents/profile");
      return response.data;
    },
  });
}

// Get parent by ID hook
export function useParentById(parentId) {
  return useQuery({
    queryKey: ["parent", parentId],
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
    mutationKey: ["parent-update"],
    mutationFn: async ({ parentId, data }) => {
      const response = await api.put(`/parents/${parentId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parent-profile"] });
    },
  });
}

// Get parent's children list
export function useParentChildren() {
  return useQuery({
    queryKey: ["parent-children"],
    queryFn: async () => {
      const response = await api.get("/parents/children");
      return response.data;
    },
  });
}

// Get progress for parent's children
export function useParentChildProgress() {
  return useQuery({
    queryKey: ["parent-child-progress"],
    queryFn: async () => {
      const response = await api.get("/parents/progress");
      return response.data;
    },
  });
}

// Get assignments for parent's children
export function useParentChildAssignments() {
  return useQuery({
    queryKey: ["parent-child-assignments"],
    queryFn: async () => {
      const response = await api.get("/parents/assignments");
      return response.data;
    },
  });
}

// Get conversations list (parent ↔ teachers)
export function useParentConversations() {
  return useQuery({
    queryKey: ["parent-conversations"],
    queryFn: async () => {
      const response = await api.get("/messages/conversations");
      return response.data;
    },
    refetchInterval: 15000, // poll every 15 seconds
  });
}

// Get messages for a specific conversation (by other user ID + their role)
export function useParentMessages(otherUserId, otherRole) {
  return useQuery({
    queryKey: ["parent-messages", otherUserId],
    queryFn: async () => {
      const response = await api.get(`/messages/${otherUserId}`, {
        params: { otherRole },
      });
      return response.data;
    },
    enabled: !!otherUserId && !!otherRole,
    refetchInterval: 10000,
  });
}

// Send a message
export function useSendParentMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["parent-send-message"],
    mutationFn: async ({ receiverId, receiverType, content }) => {
      const response = await api.post("/messages", {
        receiverId,
        receiverType,
        content,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["parent-messages", variables.receiverId],
      });
      queryClient.invalidateQueries({ queryKey: ["parent-conversations"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to send message.");
    },
  });
}

// Mark conversation messages as read
export function useMarkParentMessageRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["parent-mark-read"],
    mutationFn: async (messageId) => {
      const response = await api.patch(`/messages/${messageId}/read`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parent-conversations"] });
    },
  });
}
