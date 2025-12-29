import { z } from 'zod';

/**
 * Zod schemas related to student flows
 */

export const studentRegisterSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  age: z.number().min(1).max(18).optional(),
  grade: z.string().optional(),
});

export const studentLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default {
  studentRegisterSchema,
  studentLoginSchema,
};

