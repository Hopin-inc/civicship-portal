import { useMemo } from "react";
import {
  GqlOpportunitySlotHostingStatus,
  GqlSortDirection,
  useGetOpportunitySlotsQuery,
} from "@/types/graphql";
import { ActivitySlotGroup } from "@/app/reservation/data/type/opportunitySlot";
import { OpportunityDetail } from "@/app/activities/data/type";
import {
  groupActivitySlotsByDate,
  presenterOpportunitySlots,
} from "@/app/reservation/data/presenter/opportunitySlot";
import { presenterActivityDetail } from "@/app/activities/data/presenter";

interface UseReservationDateLoaderProps {
  opportunityId: string;
}

export const useReservationDateLoader = ({ opportunityId }: UseReservationDateLoaderProps) => {
  const { data, loading, error, refetch } = useGetOpportunitySlotsQuery({
    variables: {
      filter: {
        opportunityId,
        hostingStatus: GqlOpportunitySlotHostingStatus.Scheduled,
      },
      sort: {
        startsAt: GqlSortDirection.Desc,
      },
      first: 100, // TODO コネクションは見直す必要あり
    },
    skip: !opportunityId,
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });

  const opportunity: OpportunityDetail | null = useMemo(() => {
    const raw = data?.opportunitySlots?.edges?.find((edge) => edge?.node?.opportunity != null)?.node
      ?.opportunity;

    return raw ? presenterActivityDetail(raw) : null;
  }, [data]);

  const groupedSlots: ActivitySlotGroup[] = useMemo(() => {
    const slots = presenterOpportunitySlots(data?.opportunitySlots?.edges);
    return groupActivitySlotsByDate(slots);
  }, [data]);

  return {
    opportunity,
    groupedSlots,
    loading,
    error: error ?? null,
    refetch,
  };
};
