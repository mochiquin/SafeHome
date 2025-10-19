import { z } from "zod";

export const bookingSchema = z.object({
  service_type: z.enum(['cleaning', 'plumbing', 'electrical', 'gardening', 'other'], {
    required_error: "Please select a service type",
  }),
  budget: z.string().optional().refine(
    (val) => !val || !isNaN(Number(val)) && Number(val) >= 0,
    { message: "Budget must be a positive number" }
  ),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  duration: z.string().min(1, "Duration is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[\d\s\+\-\(\)]+$/, "Invalid phone number format"),
  description: z.string().optional(),
}).refine(
  (data) => {
    // Validate that the date is not in the past
    const selectedDate = new Date(`${data.date}T${data.time}`);
    const now = new Date();
    return selectedDate > now;
  },
  {
    message: "Selected date and time must be in the future",
    path: ["date"],
  }
);

export type BookingFormData = z.infer<typeof bookingSchema>;

