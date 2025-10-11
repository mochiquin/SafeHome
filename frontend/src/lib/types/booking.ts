/**
 * Booking status type
 */
export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'

/**
 * Booking model interface
 */
export interface Booking {
  id: string // UUID in backend
  user: string // User ID
  service: string // Service ID
  city: string
  state?: string
  country: string
  start_time: string // ISO datetime string
  duration_hours: number
  status: BookingStatus
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
  service_id: string
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
  service_id?: string
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
