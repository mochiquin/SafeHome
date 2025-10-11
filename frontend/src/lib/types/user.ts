/**
 * User model interface
 */
export interface User {
  id: number
  email: string
  username: string
  first_name: string
  last_name: string
  role?: string
  city?: string
  vaccinated?: boolean
  date_joined: string
  last_login?: string
}

/**
 * Login request interface
 */
export interface LoginRequest {
  email: string
  password: string
  role?: 'customer' | 'provider'  // Optional role specification for login
}

/**
 * Registration request interface
 */
export interface RegisterRequest {
  email: string
  username: string
  first_name: string
  last_name: string
  password: string
  password_confirm: string
  consent: boolean
  role?: string
  city?: string
  vaccinated?: boolean
}

/**
 * Authentication response interface
 */
export interface AuthResponse {
  user: User
  access_token?: string
  refresh_token?: string
}

/**
 * Dashboard data interface for different user roles
 */
export interface DashboardData {
  user: User
  stats: {
    total_bookings?: number
    available_services?: number
    total_services?: number
    total_earnings?: number
    [key: string]: any
  }
  recent_bookings?: any[]
  recent_services?: any[]
}
