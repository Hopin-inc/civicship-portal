'use client';

import { useParticipationQuery } from './useParticipationQuery';
import { transformOpportunity, transformParticipation } from '../../../transformers/participation';

/**
 * Controller hook for managing participation data
 * @param id Participation ID to fetch
 */
export const useParticipationController = (id: string) => {
  const { data, loading, error, refetch } = useParticipationQuery(id);

  const opportunityData = data?.participation?.reservation?.opportunitySlot?.opportunity || undefined;

  const formattedOpportunity = transformOpportunity(opportunityData);

  const formattedParticipation = transformParticipation(data?.participation);

  return {
    participation: formattedParticipation,
    opportunity: formattedOpportunity,
    loading,
    error,
    refetch,
  };
};
