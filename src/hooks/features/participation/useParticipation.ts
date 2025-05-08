'use client';

import { useParticipationController } from '@/hooks/features/participation/useParticipationController';
import type { Opportunity, Participation } from '@/types';

/**
 * Custom hook for managing participation data
 * This is a backward-compatible wrapper around useParticipationController
 * @param id Participation ID to fetch
 */
export const useParticipation = (id: string) => {
  return useParticipationController(id);
};                   