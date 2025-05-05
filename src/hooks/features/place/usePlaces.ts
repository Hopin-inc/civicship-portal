'use client';

import { usePlacesController } from './usePlacesController';
import type { 
  Place, 
  ParticipationView, 
  Membership, 
  PlaceData, 
  UsePlacesResult 
} from '../../../lib/transformers/place';

export type { 
  Place, 
  ParticipationView, 
  Membership, 
  PlaceData, 
  UsePlacesResult 
};

/**
 * Custom hook for managing places data and functionality
 * This is a backward-compatible wrapper around usePlacesController
 */
export const usePlaces = (): UsePlacesResult => {
  return usePlacesController();
};
