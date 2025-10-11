/**
 * Common API response interface
 */
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  status_code: number
}

/**
 * Paginated API response interface
 */
export interface PaginatedResponse<T> {
  success: boolean
  message: string
  data: {
    results: T[]
    count: number
    next?: string | null
    previous?: string | null
  }
  status_code: number
}

/**
 * API error interface
 */
export interface ApiError {
  message: string
  code?: string
  details?: Record<string, any>
}

/**
 * HTTP method type
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/**
 * Request configuration interface
 */
export interface RequestConfig {
  method?: HttpMethod
  url: string
  data?: any
  params?: Record<string, any>
  headers?: Record<string, string>
}
