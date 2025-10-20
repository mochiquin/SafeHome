/**
 * Booking status type
 */
export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'

/**
 * Service type enum
 */
export type ServiceType =
  | 'cleaning'
  | 'plumbing'
  | 'electrical'
  | 'gardening'
  | 'other'

/**
 * Booking model interface
 */
export interface Booking {
  id: string // UUID in backend
  user?: {
    id: number
    email: string
    first_name?: string
    last_name?: string
  }
  provider?: {
    id: number
    email: string
    first_name?: string
    last_name?: string
  } | null
  service_type: ServiceType // Service type (enum)
  service_type_display?: string // Human-readable service type
  budget?: number // Customer budget
  city: string
  state?: string
  country: string
  start_time: string // ISO datetime string
  duration_hours: number
  status: BookingStatus
  confirmation_code: number // 4-digit code for job verification
  notes?: string
  created_at: string
  updated_at: string
  // Frontend-only fields (computed from encrypted data)
  address?: string
  phone?: string
}

/**
 * Create booking request interface
 */
export interface CreateBookingRequest {
  service_type: ServiceType
  budget?: number
  address: string
  phone: string
  city: string
  state?: string
  country?: string
  start_time: string // ISO datetime string
  duration_hours: number
  notes?: string
}

/**
 * Update booking request interface
 */
export interface UpdateBookingRequest {
  address?: string
  phone?: string
  city?: string
  state?: string
  start_time?: string
  duration_hours?: number
  notes?: string
}

/**
 * Booking list query parameters
 */
export interface BookingListParams {
  page?: number
  page_size?: number
  status?: BookingStatus
  service_type?: ServiceType
}

/**
 * Booking statistics interface
 */
export interface BookingStats {
  total: number
  pending: number
  confirmed: number
  in_progress: number
  completed: number
  cancelled: number
}
