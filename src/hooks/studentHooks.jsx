import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "../config/axios";

// Get all lessons (public endpoint, but can filter by student's teacher)
export function useStudentLessons() {
  return useQuery({
    queryKey: ["student-lessons"],
    queryFn: async () => {
      const response = await api.get("/lessons", {
        params: {
          isActive: true, // Only get active lessons
        },
      });
      return response.data;
    },
  });
}

// Get lesson by ID
export function useStudentLessonById(lessonId) {
  return useQuery({
    queryKey: ["student-lesson", lessonId],
    queryFn: async () => {
      const response = await api.get(`/lessons/${lessonId}`);
      return response.data;
    },
    enabled: !!lessonId,
  });
}

// Get lessons by category
export function useLessonsByCategory(category) {
  return useQuery({
    queryKey: ["lessons-category", category],
    queryFn: async () => {
      const response = await api.get(`/lessons/category/${category}`);
      return response.data;
    },
    enabled: !!category,
  });
}

// Mark chapter as seen
export function useMarkChapterAsSeen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["mark-chapter-seen"],
    mutationFn: async ({ lessonId, chapterIndex }) => {
      const response = await api.put(`/lessons/${lessonId}/chapter/seen`, {
        chapterIndex: chapterIndex,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["student-lesson", variables.lessonId],
      });
      queryClient.invalidateQueries({ queryKey: ["student-lessons"] });
    },
  });
}

// Get student assignments
export function useStudentAssignments() {
  return useQuery({
    queryKey: ["student-assignments"],
    queryFn: async () => {
      const response = await api.get("/assignments/student");
      return response.data;
    },
  });
}

// Get assignment by ID (for student view)
export function useStudentAssignmentById(assignmentId) {
  return useQuery({
    queryKey: ["student-assignment", assignmentId],
    queryFn: async () => {
      const response = await api.get(`/assignments/${assignmentId}`);
      return response.data;
    },
    enabled: !!assignmentId,
  });
}

// Create submission
export function useCreateSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-submission"],
    mutationFn: async (submissionData) => {
      const response = await api.post("/submissions", submissionData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["student-assignment"] });
      toast.success("Assignment submitted!");
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Failed to submit assignment.",
      );
    },
  });
}

// Update submission
export function useUpdateSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-submission"],
    mutationFn: async ({ submissionId, submissionData }) => {
      const response = await api.put(
        `/submissions/${submissionId}`,
        submissionData,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["student-assignment"] });
      toast.success("Submission updated!");
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.message || "Failed to update submission.",
      );
    },
  });
}
