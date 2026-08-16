import { z } from 'zod';

export function isValidKenyanPhone(val: string): boolean {
  const digits = val.replace(/\D/g, '');

  if (digits.startsWith('254') && digits.length === 12) {
    return true;
  }
  if (digits.startsWith('0') && digits.length === 10) {
    return true;
  }
  if ((digits.startsWith('7') || digits.startsWith('1')) && digits.length === 9) {
    return true;
  }
  return false;
}

export const kenyanPhoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .refine(isValidKenyanPhone, {
    message: 'Enter a valid Kenyan phone number, e.g. 0712345678',
  });

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    phone: kenyanPhoneSchema,
    password: z.string().min(8, 'Password must be at least 8 characters').max(72, 'Password cannot exceed 72 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
});

export const checkoutShippingSchema = z.object({
  recipientName: z
    .string()
    .min(2, 'Recipient name must be at least 2 characters')
    .max(100, 'Recipient name cannot exceed 100 characters'),
  recipientPhone: kenyanPhoneSchema,
  dropoffZoneId: z.string().min(1, 'Please select a delivery zone'),
  dropoffAddress: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(255, 'Address cannot exceed 255 characters'),
});

export const checkoutPaymentMpesaSchema = z.object({
  payerPhone: kenyanPhoneSchema,
});

export const checkoutPaymentCardSchema = z.object({
  payerEmail: z.string().min(1, 'Email is required').email('Enter a valid email address'),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  message: z.string().min(5, 'Message must be at least 5 characters').max(1000, 'Message cannot exceed 1000 characters'),
});

export const addressSchema = z.object({
  label: z.string().min(2, 'Label must be at least 2 characters').max(50, 'Label cannot exceed 50 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters').max(255, 'Address cannot exceed 255 characters'),
});

export const newsletterSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type CheckoutShippingFormData = z.infer<typeof checkoutShippingSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type NewsletterFormData = z.infer<typeof newsletterSchema>;
