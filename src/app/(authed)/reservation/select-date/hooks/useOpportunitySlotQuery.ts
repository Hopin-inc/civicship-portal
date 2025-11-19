import { useMemo } from "react";
import {
  GqlOpportunityCategory,
  GqlOpportunitySlotHostingStatus,
  GqlSortDirection,
  useGetOpportunitySlotsLazyQuery,
  useGetOpportunitySlotsQuery,
} from "@/types/graphql";
import { ActivitySlotGroup } from "@/app/(authed)/reservation/data/type/opportunitySlot";
import { ActivityDetail, QuestDetail } from "@/components/domains/opportunities/types";
import {
  groupActivitySlotsByDate,
  presenterOpportunitySlots,
} from "@/app/(authed)/reservation/data/presenter/opportunitySlot";
import { presenterActivityDetail, presenterQuestDetail } from "@/components/domains/opportunities/data/presenter";

interface UseReservationDateLoaderProps {
  opportunityId: string;
}

export const useReservationDateLoader = ({ opportunityId }: UseReservationDateLoaderProps) => {
  const { data, loading, error, refetch } = useGetOpportunitySlotsQuery({
    variables: {
      filter: {
        opportunityIds: [opportunityId],
        hostingStatus: [GqlOpportunitySlotHostingStatus.Scheduled],
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

  const opportunity: ActivityDetail | QuestDetail | null = useMemo(() => {
    const raw = data?.opportunitySlots?.edges?.find((edge) => edge?.node?.opportunity != null)?.node
      ?.opportunity;

    if (raw?.category === GqlOpportunityCategory.Activity) {
      return presenterActivityDetail(raw);
    } else if (raw?.category === GqlOpportunityCategory.Quest) {
      return presenterQuestDetail(raw);
    }

    return null;
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
