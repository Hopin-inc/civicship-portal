"use client";

import { useGetParticipationQuery } from "@/types/graphql";
import { presenterParticipation } from "@/app/participations/[id]/data/presenter";
import { presenterActivityCard } from "@/app/activities/data/presenter";

export const useParticipation = (id: string) => {
  const { data, loading, error, refetch } = useGetParticipationQuery({
    variables: { id },
    skip: !id,
    fetchPolicy: "network-only",
  });

  const rawParticipation = data?.participation;
  const rawOpportunity = rawParticipation?.reservation?.opportunitySlot?.opportunity;

  const formattedParticipation = rawParticipation ? presenterParticipation(rawParticipation) : null;

  const formattedOpportunity = rawOpportunity ? presenterActivityCard(rawOpportunity) : null;

  return {
    participation: formattedParticipation,
    opportunity: formattedOpportunity,
    loading,
    error,
    refetch,
  };
};

export default useParticipation;
