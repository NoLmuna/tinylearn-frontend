/* eslint-disable */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../config/axios";
import { useAdmin } from "../contexts/adminContext";
import {
  teacherRegisterSchema,
  teacherLoginSchema,
} from "../schema/teacherSchema";

// Register teacher hook
export function useRegisterTeacher() {
  const { login } = useAdmin();

  return useMutation({
    mutationKey: ["teacher-register"],
    mutationFn: async (rawData) => {
      const data = teacherRegisterSchema.parse(rawData);

      // Backend: POST /api/teachers/register
      const response = await api.post("/teachers/register", data);
      return response.data;
    },
    onSuccess: (data) => {
      // Backend returns: { success: true, data: { id, firstName, lastName, email, accountStatus }, message }
      if (data?.data) {
        const _payload_remove = {
          user: {
            id: data.data.id,
            firstName: data.data.firstName,
            lastName: data.data.lastName,
            email: data.data.email,
          },
          role: "teacher",
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
    mutationKey: ["teacher-login"],
    mutationFn: async (rawData) => {
      const data = teacherLoginSchema.parse(rawData);

      // Backend: POST /api/teachers/login
      const response = await api.post("/teachers/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      // Backend returns: { success: true, data: { user: {...} }, message }
      // Token is set as HttpOnly cookie by the server; no token in response body.
      if (data?.data) {
        const payload = {
          role: "teacher",
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
    queryKey: ["teacher-profile"],
    queryFn: async () => {
      const response = await api.get("/teachers/profile");
      return response.data;
    },
  });
}

// Get teacher by ID hook
export function useTeacherById(teacherId) {
  return useQuery({
    queryKey: ["teacher", teacherId],
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
    mutationKey: ["teacher-update"],
    mutationFn: async ({ teacherId, data }) => {
      const response = await api.put(`/teachers/${teacherId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-profile"] });
    },
  });
}

// Create student hook (teacher creates student)
export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["teacher-create-student"],
    mutationFn: async (rawData) => {
      // Backend: POST /api/teachers/students
      const response = await api.post("/teachers/students", rawData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assigned-students"] });
      toast.success("Student created successfully!");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to create student.");
    },
  });
}

// Create parent hook (teacher creates parent)
export function useCreateParent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["teacher-create-parent"],
    mutationFn: async (rawData) => {
      // Backend: POST /api/teachers/parents
      const response = await api.post("/teachers/parents", rawData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assigned-students"] });
      toast.success("Parent created successfully!");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to create parent.");
    },
  });
}

// Get assigned students hook
export function useAssignedStudents(includeArchived = false) {
  return useQuery({
    queryKey: ["assigned-students", includeArchived],
    queryFn: async () => {
      const response = await api.get("/teachers/students", {
        params: { includeArchived: includeArchived },
      });
      return response.data;
    },
  });
}

// Get assigned parents hook
export function useAssignedParents(includeArchived = false) {
  return useQuery({
    queryKey: ["assigned-parents", includeArchived],
    queryFn: async () => {
      const response = await api.get("/teachers/parents", {
        params: { includeArchived: includeArchived },
      });
      return response.data;
    },
  });
}

// Get student by ID hook
export function useStudentById(studentId) {
  return useQuery({
    queryKey: ["student", studentId],
    queryFn: async () => {
      const response = await api.get(`/students/${studentId}`);
      return response.data;
    },
    enabled: !!studentId,
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

// Update student hook
export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-student"],
    mutationFn: async ({ studentId, data }) => {
      const response = await api.put(`/teachers/students/${studentId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assigned-students"] });
      queryClient.invalidateQueries({ queryKey: ["student"] });
      toast.success("Student updated!");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update student.");
    },
  });
}

// Update parent hook
export function useUpdateParent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-parent"],
    mutationFn: async ({ parentId, data }) => {
      const response = await api.put(`/teachers/parents/${parentId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assigned-parents"] });
      queryClient.invalidateQueries({ queryKey: ["parent"] });
      toast.success("Parent updated!");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update parent.");
    },
  });
}

// Archive student hook (set isActive to false)
export function useArchiveStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["archive-student"],
    mutationFn: async (studentId) => {
      const response = await api.put(`/teachers/students/${studentId}/archive`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assigned-students"] });
      queryClient.invalidateQueries({ queryKey: ["student"] });
      toast.success("Student archived.");
    },
  });
}

// Archive parent hook (set isActive to false)
export function useArchiveParent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["archive-parent"],
    mutationFn: async (parentId) => {
      const response = await api.put(`/teachers/parents/${parentId}/archive`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assigned-parents"] });
      queryClient.invalidateQueries({ queryKey: ["parent"] });
      toast.success("Parent archived.");
    },
  });
}

// Restore student hook (set isActive to true)
export function useRestoreStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["restore-student"],
    mutationFn: async (studentId) => {
      const response = await api.put(`/teachers/students/${studentId}/restore`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assigned-students"] });
      queryClient.invalidateQueries({ queryKey: ["student"] });
      toast.success("Student restored!");
    },
  });
}

// Restore parent hook (set isActive to true)
export function useRestoreParent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["restore-parent"],
    mutationFn: async (parentId) => {
      const response = await api.put(`/teachers/parents/${parentId}/restore`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assigned-parents"] });
      queryClient.invalidateQueries({ queryKey: ["parent"] });
      toast.success("Parent restored!");
    },
  });
}

// Create lesson hook
export function useCreateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-lesson"],
    mutationFn: async (lessonData) => {
      // Check if lessonData is FormData (file upload) or regular object
      const config =
        lessonData instanceof FormData
          ? {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          : {};

      const response = await api.post("/lessons", lessonData, config);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-lessons"] });
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      toast.success("Lesson created!");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to create lesson.");
    },
  });
}

// Get teacher lessons hook
export function useTeacherLessons(includeArchived = false) {
  return useQuery({
    queryKey: ["teacher-lessons", includeArchived],
    queryFn: async () => {
      const response = await api.get("/teachers/lessons", {
        params: includeArchived ? { includeArchived: "true" } : {},
      });
      return response.data;
    },
  });
}

// Get lesson by ID hook
export function useLessonById(lessonId) {
  return useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: async () => {
      const response = await api.get(`/lessons/${lessonId}`);
      return response.data;
    },
    enabled: !!lessonId,
  });
}

// Get assignment by ID hook (for teachers)
export function useAssignmentById(assignmentId) {
  return useQuery({
    queryKey: ["assignment", assignmentId],
    queryFn: async () => {
      const response = await api.get(`/assignments/${assignmentId}`);
      return response.data;
    },
    enabled: !!assignmentId,
  });
}

// Update lesson hook
export function useUpdateLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-lesson"],
    mutationFn: async ({ lessonId, lessonData }) => {
      // Check if lessonData is FormData (file upload) or regular object
      const config =
        lessonData instanceof FormData
          ? {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          : {};

      const response = await api.put(
        `/lessons/${lessonId}`,
        lessonData,
        config,
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teacher-lessons"] });
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      queryClient.invalidateQueries({
        queryKey: ["lesson", variables.lessonId],
      });
      toast.success("Lesson updated!");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update lesson.");
    },
  });
}

// Archive lesson hook (set isActive to false)
export function useArchiveLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["archive-lesson"],
    mutationFn: async (lessonId) => {
      const response = await api.put(`/lessons/${lessonId}/archive`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-lessons"] });
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      toast.success("Lesson archived.");
    },
  });
}

// Restore lesson hook (set isActive to true)
export function useRestoreLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["restore-lesson"],
    mutationFn: async (lessonId) => {
      const response = await api.put(`/lessons/${lessonId}/restore`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-lessons"] });
      queryClient.invalidateQueries({ queryKey: ["lessons"] });
      toast.success("Lesson restored!");
    },
  });
}

// Create assignment hook
export function useCreateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-assignment"],
    mutationFn: async (assignmentData) => {
      const response = await api.post("/assignments", assignmentData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      queryClient.invalidateQueries({ queryKey: ["teacher-assignments"] });
      toast.success("Assignment created!");
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Failed to create assignment.",
      );
    },
  });
}

// Get teacher assignments hook
export function useTeacherAssignments() {
  return useQuery({
    queryKey: ["teacher-assignments"],
    queryFn: async () => {
      const response = await api.get("/assignments/teacher");
      return response.data;
    },
  });
}

// Get teacher submissions hook
export function useTeacherSubmissions(filters = {}) {
  return useQuery({
    queryKey: ["teacher-submissions", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (
          filters[key] !== undefined &&
          filters[key] !== null &&
          filters[key] !== ""
        ) {
          params.append(key, filters[key]);
        }
      });
      const queryString = params.toString();
      const response = await api.get(
        `/submissions/teacher${queryString ? `?${queryString}` : ""}`,
      );
      return response.data;
    },
  });
}

// Grade submission hook
export function useGradeSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["grade-submission"],
    mutationFn: async ({ submissionId, score, feedback }) => {
      const response = await api.patch(`/submissions/${submissionId}/grade`, {
        score,
        feedback,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["teacher-assignments"] });
      toast.success("Submission graded!");
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Failed to grade submission.",
      );
    },
  });
}

// Get conversations for teacher (teacher ↔ parents)
export function useTeacherConversations() {
  return useQuery({
    queryKey: ["teacher-conversations"],
    queryFn: async () => {
      const response = await api.get("/messages/conversations");
      return response.data;
    },
    refetchInterval: 15000,
  });
}

// Get messages for a specific conversation (by other user ID + their role)
export function useTeacherMessages(otherUserId, otherRole) {
  return useQuery({
    queryKey: ["teacher-messages", otherUserId],
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

// Send a message as teacher
export function useSendTeacherMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["teacher-send-message"],
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
        queryKey: ["teacher-messages", variables.receiverId],
      });
      queryClient.invalidateQueries({ queryKey: ["teacher-conversations"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to send message.");
    },
  });
}

// Mark a message as read
export function useMarkTeacherMessageRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["teacher-mark-read"],
    mutationFn: async (messageId) => {
      const response = await api.patch(`/messages/${messageId}/read`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teacher-conversations"] });
    },
  });
}

// Get students progress records for teacher
export function useTeacherStudentsProgress() {
  return useQuery({
    queryKey: ["teacher-students-progress"],
    queryFn: async () => {
      const response = await api.get("/progress/students");
      return response.data;
    },
  });
}
