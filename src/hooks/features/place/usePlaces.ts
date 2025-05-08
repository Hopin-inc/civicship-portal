'use client';

import { usePlacesController } from '@/hooks/features/place/usePlacesController';
import type { 
  Place, 
  ParticipationView, 
  Membership, 
  PlaceData, 
  UsePlacesResult 
} from '@/presenters/place';

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
