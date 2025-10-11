// Import and re-export types explicitly to ensure proper resolution
import type {
  ApiResponse,
  PaginatedResponse,
  ApiError,
  HttpMethod,
  RequestConfig,
} from './common'

import type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  DashboardData,
} from './user'

import type {
  Service,
  ServiceFilters,
  ServiceListParams,
} from './service'

import type {
  Booking,
  BookingStatus,
  CreateBookingRequest,
  UpdateBookingRequest,
  BookingListParams,
  BookingStats,
} from './booking'

import type {
  Payment,
  PaymentStatus,
  StripeConfig,
  CreateStripeCheckoutRequest,
  StripeCheckoutResponse,
  PaymentSuccessResponse,
  PaymentQRData,
} from './payment'

// Re-export all types
export type {
  // Common types
  ApiResponse,
  PaginatedResponse,
  ApiError,
  HttpMethod,
  RequestConfig,

  // User types
  User,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  DashboardData,

  // Service types
  Service,
  ServiceFilters,
  ServiceListParams,

  // Booking types
  Booking,
  BookingStatus,
  CreateBookingRequest,
  UpdateBookingRequest,
  BookingListParams,
  BookingStats,

  // Payment types
  Payment,
  PaymentStatus,
  StripeConfig,
  CreateStripeCheckoutRequest,
  StripeCheckoutResponse,
  PaymentSuccessResponse,
  PaymentQRData,
}
