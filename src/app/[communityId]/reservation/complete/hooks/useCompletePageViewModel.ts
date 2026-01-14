import { useMemo } from "react";
import {
  presenterActivityCard,
  presenterReservationDateTimeInfo,
} from "@/components/domains/opportunities/data/presenter";
import { useCompletePageDataRaw } from "./useCompletePageDataRaw";
import { presenterArticleCard } from "@/app/[communityId]/articles/data/presenter";

export function useCompletePageViewModel(
  opportunityId: string | null,
  reservationId: string | null,
) {
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
    return gqlOpportunity ? presenterActivityCard(gqlOpportunity) : null;
  }, [gqlOpportunity]);

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
