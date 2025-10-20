import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["customer", "provider"]).optional(),
})

export const registerSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirm: z.string(),
  consent: z.boolean().refine(val => val === true, "You must agree to the terms and conditions"),
  role: z.enum(["customer", "provider"]),
  city: z.string().optional(),
  vaccinated: z.boolean(),
  provider_id: z.string().optional(),
}).refine((data) => data.password === data.password_confirm, {
  message: "Passwords do not match",
  path: ["password_confirm"],
}).refine((data) => {
  // Provider ID is required for providers and must be exactly 16 characters
  if (data.role === "provider") {
    return data.provider_id && data.provider_id.length === 16;
  }
  return true;
}, {
  message: "Provider ID is required and must be exactly 16 characters",
  path: ["provider_id"],
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
