import { BaseApiClient } from './base'
import type { ApiResponse, PaginatedResponse } from '../types/common'
import type { Service, ServiceFilters, ServiceListParams } from '../types/service'

export class ServicesApiClient extends BaseApiClient {
  constructor() {
    super('/services')
  }

  /**
   * Get services list with pagination and filtering
   */
  async getServices(params?: ServiceListParams): Promise<PaginatedResponse<Service>> {
    return this.getPaginated<Service>('', params)
  }

  /**
   * Get single service details
   */
  async getService(id: string): Promise<ApiResponse<Service>> {
    return this.get<Service>(`/${id}`)
  }

  /**
   * Create new service (admin only)
   */
  async createService(data: Omit<Service, 'id'>): Promise<ApiResponse<Service>> {
    return this.post<Service>('', data)
  }

  /**
   * Update service information (admin only)
   */
  async updateService(id: string, data: Partial<Service>): Promise<ApiResponse<Service>> {
    return this.patch<Service>(`/${id}`, data)
  }

  /**
   * Delete service (admin only)
   */
  async deleteService(id: string): Promise<ApiResponse<void>> {
    return this.delete<void>(`/${id}`)
  }

  /**
   * Get service categories list
   */
  async getCategories(): Promise<ApiResponse<string[]>> {
    return this.get<string[]>('/categories')
  }

  /**
   * Get services by location
   */
  async getServicesByLocation(city: string): Promise<PaginatedResponse<Service>> {
    return this.getPaginated<Service>('/by-location', { city })
  }
}

// Export singleton instance
export const servicesApi = new ServicesApiClient()
