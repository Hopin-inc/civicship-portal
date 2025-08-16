import { presenterActivityDetail, presenterQuestDetail } from "@/components/domains/opportunities/data/presenter";
import { ActivityDetail, QuestDetail } from "@/components/domains/opportunities/types";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { GqlOpportunityCategory, GqlOpportunitySlotHostingStatus, GqlSortDirection, GqlUser, Maybe, useGetOpportunityQuery } from "@/types/graphql";
import { useMemo } from "react";
import { useSameStateOpportunities } from "./useSameStateOpportunities";
import { useAvailableTickets } from "@/app/tickets/hooks/useAvailableTickets";
import { useFilterFutureSlots } from "./useFilterFutureSlots";
import { useSortedSlotsByStartsAt } from "./useSortedSlotsByStartsAt";

export const useOpportunityDetail = (id: string, user: Maybe<GqlUser> | undefined) => {
    const { data, loading, error, refetch } = useGetOpportunityQuery({
        variables: {
          id,
          permission: { communityId: COMMUNITY_ID },
          slotSort: { startsAt: GqlSortDirection.Asc },
          slotFilter: { hostingStatus: [GqlOpportunitySlotHostingStatus.Scheduled] },
        },
        skip: !id,
        fetchPolicy: "network-only",
        errorPolicy: "all",
      })

    const opportunity: ActivityDetail | QuestDetail | null = useMemo(() => {
    if(data?.opportunity && data.opportunity.category === GqlOpportunityCategory.Activity) return presenterActivityDetail(data.opportunity);
    if(data?.opportunity && data.opportunity.category === GqlOpportunityCategory.Quest) return presenterQuestDetail(data.opportunity);
    return data?.opportunity ? presenterActivityDetail(data.opportunity) : null;
    }, [data?.opportunity]);

    const stateCode = data?.opportunity?.place?.city?.state?.code;

    const {
    sameStateOpportunities,
    loading: loadingSameState,
    error: errorSameState,
    refetch: refetchSameState,
    } = useSameStateOpportunities(id, stateCode ?? "");


    const availableTickets = useAvailableTickets(opportunity, user?.id);
    const futureSlots = useFilterFutureSlots(opportunity?.slots);
    const sortedSlots = useSortedSlotsByStartsAt(futureSlots);

    return {
        data,
        opportunity,
        sameStateOpportunities,
        availableTickets,
        sortedSlots,
        loading,
        error,
        refetch,
    }
};