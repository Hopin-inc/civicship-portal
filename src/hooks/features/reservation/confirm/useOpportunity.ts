import { useMemo } from "react";
import { useGetOpportunityQuery } from "@/types/graphql";
import { COMMUNITY_ID } from "@/utils";
import { presenterActivityDetail } from "@/presenters/opportunity";
import type { ActivityDetail } from "@/types/opportunity";

export function useOpportunityData(opportunityId: string) {
  const { data, loading, error } = useGetOpportunityQuery({
    variables: {
      id: opportunityId,
      permission: { communityId: COMMUNITY_ID },
    },
    skip: !opportunityId,
    fetchPolicy: "network-only",
    errorPolicy: "all",
    onError: (err) => console.error("Opportunity query error:", err),
  });

  const opportunity: ActivityDetail | null = useMemo(() => {
    return data?.opportunity ? presenterActivityDetail(data.opportunity) : null;
  }, [data]);

  return { opportunity, loading, error: error ?? null };
}
