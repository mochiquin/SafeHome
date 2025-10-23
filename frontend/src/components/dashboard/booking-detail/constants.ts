import type { BookingStatus } from "@/lib/types/booking";

/**
 * Status color mappings for booking statuses
 */
export const STATUS_COLORS: Record<BookingStatus, string> = {
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  in_progress: "bg-orange-100 text-orange-800 border-orange-200"
};

/**
 * Status label mappings for booking statuses
 */
export const STATUS_LABELS: Record<BookingStatus, string> = {
  confirmed: "Confirmed",
  completed: "Completed",
  pending: "Pending",
  cancelled: "Cancelled",
  in_progress: "In Progress"
};

/**
 * Section titles for booking detail page
 */
export const SECTION_TITLES = {
  service: "Service Information",
  schedule: "Schedule",
  location: "Location",
  contact: "Contact",
  confirmation: "Confirmation Code",
  provider: "Provider Information",
  notes: "Additional Notes"
};

/**
 * Date formatting options
 */
export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
};

/**
 * Time formatting options
 */
export const TIME_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit'
};

/**
 * Confirmation code hint text
 */
export const CONFIRMATION_CODE_HINT = "Share this code with your provider to start the job";

/**
 * Button labels
 */
export const BUTTON_LABELS = {
  back: "Back",
  payNow: "Pay Now",
  paid: "Paid",
  cancelBooking: "Cancel Booking",
  cancelling: "Cancelling...",
  redirecting: "Redirecting...",
  viewDetails: "View Details",
  noKeepIt: "No, Keep It",
  yesCancelBooking: "Yes, Cancel Booking"
};

/**
 * Dialog messages
 */
export const DIALOG_MESSAGES = {
  cancelTitle: "Cancel Booking",
  cancelDescription: "Are you sure you want to cancel this booking? This action cannot be undone."
};

/**
 * Field labels
 */
export const FIELD_LABELS = {
  bookingId: "Booking ID",
  serviceType: "Service Type",
  customerBudget: "Customer Budget",
  date: "Date",
  time: "Time",
  duration: "Duration",
  hours: "hour(s)",
  address: "Address",
  city: "City",
  state: "State",
  country: "Country",
  map: "Map",
  phoneNumber: "Phone Number",
  providerName: "Provider Name",
  providerEmail: "Provider Email",
  providerQuote: "Provider Quote",
  notProvided: "Not provided"
};

