// API客户端统一导出
export { authApi } from './auth'
export { servicesApi } from './services'
export { bookingsApi } from './bookings'
export { paymentsApi } from './payments'

// 导出类型
export type * from '../types/api'

// 导出基础类（如果需要自定义）
export { BaseApiClient } from './base'
