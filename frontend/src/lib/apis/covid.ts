/**
 * COVID restriction API client
 */
import { BaseApiClient } from './base';
import type { ApiResponse } from '../types/api';
import type { CovidRestriction, CovidRestrictionRequest } from '../types/covid';

export class CovidApiClient extends BaseApiClient {
  constructor() {
    super('/covid');
  }

  /**
   * Get COVID restriction level for a location
   */
  async getRestriction(params: CovidRestrictionRequest): Promise<ApiResponse<CovidRestriction>> {
    const queryParams = new URLSearchParams();
    queryParams.append('country', params.country);
    if (params.state) queryParams.append('state', params.state);
    // Clean city name: remove trailing slashes and extra spaces
    if (params.city) {
      const cleanCity = params.city.trim().replace(/\/+$/, '');
      if (cleanCity) {
        queryParams.append('city', cleanCity);
      }
    }

    return this.get<CovidRestriction>(`/restriction?${queryParams.toString()}`);
  }
}

export const covidApi = new CovidApiClient();

