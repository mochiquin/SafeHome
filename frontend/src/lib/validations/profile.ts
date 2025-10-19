import * as z from 'zod';

// Validation schema for the profile form
export const profileSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address').readonly(),
  city: z.string().optional(),
  // Add other fields from your User model that you want to be updatable
  // For example:
  // phone: z.string().optional(),
  // street: z.string().optional(),
  // state: z.string().optional(),
  // postCode: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
