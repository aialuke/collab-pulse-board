
import * as z from 'zod';

// Common validation patterns
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const PASSWORD_MIN_LENGTH = 8;

// Base validation schemas
export const emailSchema = z.string()
  .min(1, 'Email is required')
  .regex(EMAIL_REGEX, 'Please enter a valid email address');

export const passwordSchema = z.string()
  .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters`);

export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters');

// Form-specific schemas
export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signUpSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string()
    .min(1, 'Please confirm your password'),
}).refine(
  (data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }
);

export type SignInFormValues = z.infer<typeof signInSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;

// Feedback form schema
export const feedbackSchema = z.object({
  content: z.string().min(3, 'Content is required'),
  categoryId: z.string().min(1, 'Category is required'),
  imageUrl: z.string().optional(),
  linkUrl: z.string().url('Please enter a valid URL').optional().or(z.literal('')),
});

export type FeedbackFormValues = z.infer<typeof feedbackSchema>;
