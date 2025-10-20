import { BaseApiClient } from './base'
import type { ApiResponse, PaginatedResponse } from '../types/common'
import type {
  Booking,
  CreateBookingRequest,
  UpdateBookingRequest,
  BookingListParams,
  BookingStats
} from '../types/booking'

export class BookingsApiClient extends BaseApiClient {
  constructor() {
    super('/bookings')
  }

  /**
   * Create a new booking
   */
  async createBooking(data: CreateBookingRequest): Promise<ApiResponse<Booking>> {
    return this.post<Booking>('/create/', data)
  }

  /**
   * Get user's bookings list
   */
  async getBookings(params?: BookingListParams): Promise<ApiResponse<Booking[]>> {
    return this.get<Booking[]>('/my-bookings/', { params })
  }

  /**
   * Get booking details by ID
   */
  async getBooking(id: string): Promise<ApiResponse<Booking>> {
    return this.get<Booking>(`/${id}`)
  }

  /**
   * Update booking
   */
  async updateBooking(id: string, data: UpdateBookingRequest): Promise<ApiResponse<Booking>> {
    return this.patch<Booking>(`/${id}`, data)
  }

  /**
   * Get user's booking statistics
   */
  async getBookingStats(): Promise<ApiResponse<BookingStats>> {
    return this.get<BookingStats>('/stats')
  }

  /**
   * Get all bookings for providers (Received Orders - bookings accepted by provider)
   */
  async getProviderBookings(): Promise<ApiResponse<Booking[]>> {
    return this.get<Booking[]>('/provider/received/')
  }

  /**
   * Get available tasks for providers (bookings without provider assigned)
   */
  async getAvailableTasks(): Promise<ApiResponse<Booking[]>> {
    return this.get<Booking[]>('/provider/available/')
  }

  /**
   * Accept a booking (provider accepts an available task)
   */
  async acceptBooking(bookingId: string): Promise<ApiResponse<Booking>> {
    return this.patch<Booking>(`/${bookingId}/accept/`)
  }

  /**
   * Cancel a booking (customer cancels their booking)
   */
  async cancelBooking(bookingId: string): Promise<ApiResponse<Booking>> {
    return this.patch<Booking>(`/${bookingId}/cancel/`)
  }

  /**
   * Start a job (provider starts a confirmed booking)
   */
  async startJob(bookingId: string, confirmationCode: string): Promise<ApiResponse<Booking>> {
    return this.patch<Booking>(`/${bookingId}/start/`, { confirmation_code: confirmationCode })
  }

  /**
   * Complete a job (provider completes an in-progress booking)
   */
  async completeJob(bookingId: string): Promise<ApiResponse<Booking>> {
    return this.patch<Booking>(`/${bookingId}/complete/`)
  }
}

// Export singleton instance
export const bookingsApi = new BookingsApiClient()
