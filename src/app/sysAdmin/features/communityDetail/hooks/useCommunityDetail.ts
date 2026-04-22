"use client";

import type { ApolloError } from "@apollo/client";
import {
  type GqlSysAdminCommunityDetailPayload,
  useGetSysAdminCommunityDetailQuery,
} from "@/types/graphql";
import type { DashboardControlsState } from "@/app/sysAdmin/features/dashboard/hooks/useDashboardControls";
import type { DetailControlsState } from "./useDetailControls";

type Args = {
  communityId: string;
  dashboardControls: DashboardControlsState;
  detailControls: DetailControlsState;
  limit?: number;
};

export type CommunityDetailResult = {
  loading: boolean;
  error: ApolloError | undefined;
  detail: GqlSysAdminCommunityDetailPayload | null;
};

export function useCommunityDetail({
  communityId,
  dashboardControls,
  detailControls,
  limit = 50,
}: Args): CommunityDetailResult {
  const { data, loading, error } = useGetSysAdminCommunityDetailQuery({
    variables: {
      input: {
        communityId,
        asOf: dashboardControls.asOf ? new Date(dashboardControls.asOf) : undefined,
        segmentThresholds: {
          tier1: dashboardControls.tier1,
          tier2: dashboardControls.tier2,
        },
        windowMonths: detailControls.windowMonths,
        userFilter: {
          minSendRate: detailControls.filter.minSendRate ?? undefined,
          maxSendRate: detailControls.filter.maxSendRate ?? undefined,
          minDonationOutMonths: detailControls.filter.minDonationOutMonths ?? undefined,
          minMonthsIn: detailControls.filter.minMonthsIn ?? undefined,
        },
        userSort: {
          field: detailControls.sort.field,
          order: detailControls.sort.order,
        },
        limit,
      },
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  return {
    loading,
    error,
    detail: data?.sysAdminCommunityDetail ?? null,
  };
}
