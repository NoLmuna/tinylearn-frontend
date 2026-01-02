import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../config/axios';

// Get all lessons (public endpoint, but can filter by student's teacher)
export function useStudentLessons() {
  return useQuery({
    queryKey: ['student-lessons'],
    queryFn: async () => {
      const response = await api.get('/lessons', {
        params: {
          isActive: true // Only get active lessons
        }
      });
      return response.data;
    },
  });
}

// Get lesson by ID
export function useStudentLessonById(lessonId) {
  return useQuery({
    queryKey: ['student-lesson', lessonId],
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
    queryKey: ['lessons-category', category],
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
    mutationKey: ['mark-chapter-seen'],
    mutationFn: async ({ lessonId, chapterIndex }) => {
      const response = await api.put(`/lessons/${lessonId}/chapter/seen`, {
        chapterIndex: chapterIndex
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['student-lesson', variables.lessonId] });
      queryClient.invalidateQueries({ queryKey: ['student-lessons'] });
    },
  });
}

