import api from '../axios'
import type { ApiResponse, RequestConfig, PaginatedResponse } from '../types/common'

export class BaseApiClient {
  protected baseURL: string

  constructor(baseURL: string = '') {
    this.baseURL = baseURL
  }

  protected async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await api.request<ApiResponse<T>>({
        method: config.method || 'GET',
        url: this.baseURL + config.url,
        data: config.data,
        params: config.params,
        headers: config.headers,
      })

      return response.data
    } catch (error: any) {
      // If server returned error response, throw response data
      if (error.response?.data) {
        throw error.response.data
      }
      // Otherwise throw generic error
      throw {
        success: false,
        message: error.message || 'Network error',
        status_code: 0,
      }
    }
  }

  protected async get<T = any>(url: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'GET', url, params })
  }

  protected async post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'POST', url, data })
  }

  protected async put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PUT', url, data })
  }

  protected async patch<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PATCH', url, data })
  }

  protected async delete<T = any>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'DELETE', url })
  }

  protected async getPaginated<T = any>(
    url: string,
    params?: Record<string, any>
  ): Promise<PaginatedResponse<T>> {
    const response = await this.get<{ results: T[]; count: number; next?: string; previous?: string }>(
      url,
      params
    )
    return response as PaginatedResponse<T>
  }
}
