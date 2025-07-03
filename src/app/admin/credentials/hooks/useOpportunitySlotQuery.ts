import { useMemo } from "react";
import {
  GqlOpportunitySlotEdge,
  GqlOpportunitySlotHostingStatus,
  GqlSortDirection,
  useGetOpportunitySlotsQuery,
} from "@/types/graphql";
import { ActivityDetail } from "@/app/activities/data/type";
import { presenterActivityDetail } from "@/app/activities/data/presenter";
import { ActivitySlotGroupWithOpportunityId } from "../types/opportunitySlot";
import { groupActivitySlotsByDate, presenterOpportunitySlots } from "../data/presenter/opportunitySlot";

interface UseReservationDateLoaderProps {
  opportunityIds: string[];
}

export const useReservationDateLoader = ({ opportunityIds }: UseReservationDateLoaderProps) => {
  const { data, loading, error, refetch } = useGetOpportunitySlotsQuery({
    variables: {
      filter: {
        opportunityIds: opportunityIds,
        hostingStatus: [GqlOpportunitySlotHostingStatus.Scheduled, GqlOpportunitySlotHostingStatus.Completed],
      },
      sort: {
        startsAt: GqlSortDirection.Desc,
      },
      first: 100, // TODO コネクションは見直す必要あり
    },
    skip: !opportunityIds,
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });
  const opportunity: ActivityDetail | null = useMemo(() => {
    const raw = data?.opportunitySlots?.edges?.find((edge) => edge?.node?.opportunity != null)?.node
      ?.opportunity;

    return raw ? presenterActivityDetail(raw) : null;
  }, [data]);

  const groupedSlots: ActivitySlotGroupWithOpportunityId[] = useMemo(() => {
    const slots = presenterOpportunitySlots(data?.opportunitySlots?.edges as GqlOpportunitySlotEdge[]);
    return groupActivitySlotsByDate(slots).map((group) => ({
      ...group,
      opportunityId: group.slots[0]?.opportunityId ?? "",
    }));
  }, [data]);

  return {
    opportunity,
    groupedSlots,
    loading,
    error: error ?? null,
    refetch,
  };
};
