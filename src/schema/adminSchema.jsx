import { z } from 'zod';

/**
 * Zod schemas related to admin/auth flows
 */

export const adminLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const adminCreateTeacherSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  bio: z.string().optional(),
  subjectSpecialty: z.string().optional(),
});

export default {
  adminLoginSchema,
  adminCreateTeacherSchema,
};

