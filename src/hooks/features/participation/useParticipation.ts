'use client';

import { useGetParticipationQuery } from "@/types/graphql";
import { transformOpportunity, transformParticipation } from '@/presenters/participation';

export const useParticipation = (id: string) => {
  const { data, loading, error, refetch } = useGetParticipationQuery(
    {
      variables: { id },
      skip: !id,
      fetchPolicy: 'network-only',
    }
  )
  const opportunityData = data?.participation?.reservation?.opportunitySlot?.opportunity;
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

export default useParticipation;
