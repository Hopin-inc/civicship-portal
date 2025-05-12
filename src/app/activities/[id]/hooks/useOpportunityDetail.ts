"use client";

import { useMemo } from "react";
import { COMMUNITY_ID } from "@/utils";
import { useGetOpportunityQuery } from "@/types/graphql";
import { presenterActivityDetail } from "@/app/activities/data/presenter";
import { ActivityDetail } from "@/app/activities/data/type";

export const useOpportunityDetail = (id: string) => {
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

  return {
    data,
    opportunity,
    loading,
    error,
  };
};
