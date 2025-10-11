/**
 * Service model interface
 */
export interface Service {
  id: string // UUID in backend
  title: string
  description?: string
  price: number
  category: string
  is_active: boolean
  estimated_duration?: number
}

/**
 * Service filters interface for querying services
 */
export interface ServiceFilters {
  category?: string
  min_price?: number
  max_price?: number
  city?: string
}

/**
 * Service list query parameters
 */
export interface ServiceListParams extends ServiceFilters {
  page?: number
  page_size?: number
}
