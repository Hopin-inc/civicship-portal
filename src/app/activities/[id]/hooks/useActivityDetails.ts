"use client";

import { useEffect, useMemo } from "react";
import { COMMUNITY_ID } from "@/utils";
import { useLoading } from "@/hooks/useLoading";
import { useAvailableTickets } from "@/app/tickets/hooks/useAvailableTickets";
import { useAvailableDatesQuery } from "@/app/activities/[id]/hooks/useAvailableDatesQuery";
import { useSimilarOpportunitiesQuery } from "@/app/activities/[id]/hooks/useSimilarOpportunitiesQuery";
import { ActivityCard, ActivityDetail } from "@/app/activities/data/type";
import { GqlOpportunity, useGetOpportunityQuery } from "@/types/graphql";
import { presenterActivityCard, presenterActivityDetail } from "@/app/activities/data/presenter";

interface UseActivityDetailsResult {
  opportunity: ActivityDetail | null;
  similarActivities: ActivityCard[];
  availableTickets: number;
  availableDates: {
    id: string;
    startsAt: string;
    endsAt: string;
    participants: number;
    price: number;
  }[];
  loading: boolean;
  initialLoading: boolean;
  error: Error | null;
}

export const useActivityDetails = (id: string): UseActivityDetailsResult => {
  const { setIsLoading } = useLoading();

  const { data, loading, error } = useGetOpportunityQuery({
    variables: {
      id,
      permission: { communityId: COMMUNITY_ID },
    },
    skip: !id,
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });

  const opportunity: ActivityDetail | null = useMemo(() => {
    return data?.opportunity ? presenterActivityDetail(data.opportunity) : null;
  }, [data?.opportunity]);

  const { similarOpportunities, loading: similarLoading } = useSimilarOpportunitiesQuery({
    opportunityId: id,
  });

  const similarActivities: ActivityCard[] = useMemo(() => {
    return (similarOpportunities ?? [])
      .filter((node): node is GqlOpportunity => !!node)
      .map(presenterActivityCard);
  }, [similarOpportunities]);

  const availableTickets = useAvailableTickets(opportunity, undefined);
  const { availableDates } = useAvailableDatesQuery(opportunity?.slots);

  const isLoading = loading || similarLoading;
  const initialLoading = isLoading && !data?.opportunity && !error;

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  return {
    opportunity,
    similarActivities,
    availableTickets,
    availableDates,
    loading: isLoading,
    initialLoading,
    error: error || null,
  };
};
