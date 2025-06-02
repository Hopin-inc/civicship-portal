"use client";

import { useEffect, useMemo } from "react";
import { COMMUNITY_ID } from "@/utils";
import {
  GqlOpportunitySlotHostingStatus,
  GqlSortDirection,
  useGetOpportunityQuery,
} from "@/types/graphql";
import { presenterActivityDetail } from "@/app/activities/data/presenter";
import { ActivityDetail } from "@/app/activities/data/type";
import clientLogger from "@/lib/logging/client";

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

  const opportunity: ActivityDetail | null = useMemo(() => {
    return data?.opportunity ? presenterActivityDetail(data.opportunity) : null;
  }, [data?.opportunity]);

  useEffect(() => {
    if (data && !loading) {
      clientLogger.info("Opportunity detail query completed", {
        component: "useOpportunityDetail",
        operation: "getOpportunity",
        opportunityId: id,
        hasData: !!data?.opportunity
      });
    }
  }, [data, loading, id]);

  useEffect(() => {
    if (error) {
      clientLogger.error("Opportunity detail query failed", {
        component: "useOpportunityDetail",
        operation: "getOpportunity",
        opportunityId: id,
        error: error.message
      });
    }
  }, [error, id]);

  return {
    data,
    opportunity,
    loading,
    error,
    refetch,
  };
};
