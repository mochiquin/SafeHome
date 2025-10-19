import api from '../axios'
import { type AxiosRequestConfig } from 'axios'
import type { ApiResponse } from '../types'
import { getErrorMessage } from '../utils'
import { enc } from '../crypto'

interface RequestConfig extends AxiosRequestConfig {
  // We can add custom config fields here if needed
}

export class BaseApiClient {
  private client
  private basePath: string

  constructor(basePath: string = '') {
    this.client = api
    this.basePath = basePath
  }

  private _getEndpoint(endpoint: string): string {
    const path = [this.basePath, endpoint].join('/').replace(/\/+/g, '/');
    return path.endsWith('/') ? path : `${path}/`;
  }

  protected async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    try {
      let dataToSend = config.data;

      // Encrypt the body for POST, PUT, and PATCH requests
      if (['POST', 'PUT', 'PATCH'].includes(config.method?.toUpperCase() || '') && dataToSend) {
        const encryptedPayload = await enc(JSON.stringify(dataToSend));
        dataToSend = { payload: encryptedPayload };
      }

      const response = await this.client.request<ApiResponse<T>>({
        ...config,
        url: this._getEndpoint(config.url || ''),
        data: dataToSend,
      });

      if (response.data && response.data.success) {
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      } else {
        console.error('API response error:', response.data);
        throw new Error(response.data?.message || 'An unknown error occurred');
      }
    } catch (error: any) {
      const message = getErrorMessage(error);
      console.error('API request error:', message);
      console.error('Error details:', error);
      console.error('Response data:', error.response?.data);
      // Re-throw a structured error
      throw {
        success: false,
        message: message,
        data: error.response?.data?.data,
      };
    }
  }

  protected async get<T>(endpoint: string, config: Omit<RequestConfig, 'method' | 'url'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url: endpoint });
  }

  protected async post<T>(endpoint: string, data?: any, config: Omit<RequestConfig, 'method' | 'url' | 'data'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url: endpoint, data });
  }

  protected async put<T>(endpoint: string, data?: any, config: Omit<RequestConfig, 'method' | 'url' | 'data'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url: endpoint, data });
  }

  protected async patch<T>(endpoint: string, data?: any, config: Omit<RequestConfig, 'method' | 'url' | 'data'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url: endpoint, data });
  }

  protected async delete<T>(endpoint: string, config: Omit<RequestConfig, 'method' | 'url'> = {}): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url: endpoint });
  }
}
