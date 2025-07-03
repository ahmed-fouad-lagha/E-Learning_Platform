import { z } from 'zod';

// Authentication schemas
export const loginSchema = z.object({
  emailOrPhone: z.string().min(1, 'البريد الإلكتروني أو رقم الهاتف مطلوب'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
  phone: z.string().optional(),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  confirmPassword: z.string(),
  role: z.enum(['STUDENT', 'TEACHER', 'PARENT']).default('STUDENT'),
  grade: z.string().optional(),
  wilaya: z.string().optional(),
  school: z.string().optional(),
  parentPhone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'يجب الموافقة على الشروط والأحكام',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
});

// Profile update schema
export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  phone: z.string().optional(),
  grade: z.string().optional(),
  wilaya: z.string().optional(),
  school: z.string().optional(),
  parentPhone: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

// Password change schema
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
  newPassword: z.string().min(6, 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل'),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'كلمات المرور الجديدة غير متطابقة',
  path: ['confirmNewPassword'],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type PasswordChangeInput = z.infer<typeof passwordChangeSchema>;