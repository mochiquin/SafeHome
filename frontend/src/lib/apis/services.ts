import { BaseApiClient } from './base'
import type { ApiResponse } from '../types/common'
import type { Service } from '../types/service'

export class ServicesApiClient extends BaseApiClient {
  constructor() {
    super('/services')
  }

  async getService(id: string): Promise<ApiResponse<Service>> {
    return this.get<Service>(`/${id}`)
  }

  async getServices(): Promise<ApiResponse<Service[]>> {
    return this.get<Service[]>('/')
  }
}

export const servicesApi = new ServicesApiClient()
