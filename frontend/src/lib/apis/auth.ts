import { BaseApiClient } from './base'
import type { ApiResponse } from '../types/common'
import type { LoginRequest, RegisterRequest, AuthResponse, User, DashboardData } from '../types/user'

export class AuthApiClient extends BaseApiClient {
  constructor() {
    super('/auth')
  }

  /**
   * User login with optional role specification
   */
  async login(data: LoginRequest & { role?: 'customer' | 'provider' }): Promise<ApiResponse<{ user: User }>> {
    return this.post<{ user: User }>('/login/', data)
  }

  /**
   * User registration
   */
  async register(data: RegisterRequest): Promise<ApiResponse<{ user: User }>> {
    return this.post<{ user: User }>('/register/', data)
  }

  /**
   * Get current user profile information
   */
  async me(): Promise<ApiResponse<User>> {
    return this.get<User>('/me/')
  }

  /**
   * Update user profile information
   */
  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return this.patch<User>('/me/', data)
  }

  /**
   * User logout
   */
  async logout(): Promise<ApiResponse<void>> {
    return this.post<void>('/logout/')
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<ApiResponse<{ access_token: string }>> {
    return this.post<{ access_token: string }>('/refresh/')
  }

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<ApiResponse<void>> {
    return this.delete<void>('/me/')
  }

  /**
   * Get customer dashboard data
   */
  async getCustomerDashboard(): Promise<ApiResponse<DashboardData>> {
    return this.get<DashboardData>('/customer/dashboard/')
  }

  /**
   * Get provider dashboard data
   */
  async getProviderDashboard(): Promise<ApiResponse<DashboardData>> {
    return this.get<DashboardData>('/provider/dashboard/')
  }
}

// Export singleton instance
export const authApi = new AuthApiClient()
