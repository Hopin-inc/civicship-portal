import { useMemo } from "react";
import {
  presenterActivityCard,
  presenterReservationDateTimeInfo,
} from "@/components/domains/opportunities/data/presenter";
import { useCompletePageDataRaw } from "./useCompletePageDataRaw";
import { presenterArticleCard } from "@/app/community/[communityId]/articles/data/presenter";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

export function useCompletePageViewModel(
  opportunityId: string | null,
  reservationId: string | null,
) {
  const config = useCommunityConfig();
  const communityId = config?.communityId ?? null;

  const {
    reservation,
    gqlOpportunity,
    gqlOpportunitySlot,
    gqlArticle,
    sameStateOpportunities,
    loading,
    error,
    refetch,
  } = useCompletePageDataRaw(opportunityId, reservationId);

  const opportunity = useMemo(() => {
    return gqlOpportunity ? presenterActivityCard(gqlOpportunity, communityId) : null;
  }, [gqlOpportunity, communityId]);

  const dateTimeInfo = useMemo(() => {
    if (!reservation || !gqlOpportunity || !gqlOpportunitySlot) return null;
    return presenterReservationDateTimeInfo(gqlOpportunitySlot, gqlOpportunity, reservation);
  }, [reservation, gqlOpportunity, gqlOpportunitySlot]);

  const articleCard = useMemo(() => {
    return gqlArticle && gqlArticle.length > 0 ? presenterArticleCard(gqlArticle[0]) : undefined;
  }, [gqlArticle]);

  return {
    reservation,
    opportunity,
    articleCard,
    dateTimeInfo,
    sameStateOpportunities,
    loading,
    error,
    refetch,
  };
}
