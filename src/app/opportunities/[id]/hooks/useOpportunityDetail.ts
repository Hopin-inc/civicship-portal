"use client";

import { useMemo } from "react";
import { COMMUNITY_ID } from "@/utils";
import {
  GqlOpportunitySlotHostingStatus,
  GqlSortDirection,
  useGetOpportunityQuery,
} from "@/types/graphql";
import { presenterOpportunityDetail } from "../../data/presenter";
import { OpportunityDetail } from "../../data/type";

export const useOpportunityDetail = (id: string) => {
  const { data, loading, error, refetch } = useGetOpportunityQuery({
    variables: {
      id,
      permission: { communityId: COMMUNITY_ID },
      slotSort: { startsAt: GqlSortDirection.Asc },
      slotFilter: { hostingStatus: GqlOpportunitySlotHostingStatus.Scheduled },
    },
    skip: !id,
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });

  const opportunity: OpportunityDetail | null = useMemo(() => {
    return data?.opportunity ? presenterOpportunityDetail(data.opportunity) : null;
  }, [data?.opportunity]);

  return {
    data,
    opportunity,
    loading,
    error,
    refetch,
  };
};
