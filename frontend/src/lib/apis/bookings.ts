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
    return this.post<Booking>('/create', data)
  }

  /**
   * Get user's bookings list
   */
  async getBookings(params?: BookingListParams): Promise<PaginatedResponse<Booking>> {
    return this.getPaginated<Booking>('/my-bookings', params)
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
    return this.patch<Booking>(`/${id}/update`, data)
  }

  /**
   * Get user's booking statistics
   */
  async getBookingStats(): Promise<ApiResponse<BookingStats>> {
    return this.get<BookingStats>('/stats')
  }
}

// Export singleton instance
export const bookingsApi = new BookingsApiClient()
