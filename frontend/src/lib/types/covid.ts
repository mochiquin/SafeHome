/**
 * COVID restriction types
 */

export type RestrictionLevel = 'high' | 'medium' | 'low' | 'unknown';

export interface CovidRestriction {
  restriction_level: RestrictionLevel;
  country: string;
  state?: string;
  city?: string;
}

export interface CovidRestrictionRequest {
  country: string;
  state?: string;
  city?: string;
}

