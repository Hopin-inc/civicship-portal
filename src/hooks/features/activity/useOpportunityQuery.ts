'use client';

import { useQuery } from "@apollo/client";
import { GET_OPPORTUNITY } from "@/graphql/experience/opportunity/query";
import { COMMUNITY_ID } from "@/utils";

export const useOpportunityQuery = (id: string) => {
  const isValidId = Boolean(id && id.trim());

  return useQuery(GET_OPPORTUNITY, {
    variables: {
      id,
      permission: {
        communityId: COMMUNITY_ID,
      },
    },
    skip: !isValidId,
    fetchPolicy: "network-only",
    errorPolicy: "all",
    onError: (error) => {
      console.error("Opportunity query error:", error);
    },
  });
};
