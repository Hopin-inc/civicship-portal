"use client";

import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { useGetArticleQuery } from "@/types/graphql";

export const useArticleQuery = (id: string) => {
  // Use runtime communityId from CommunityConfigContext
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId || "";
  
  return useGetArticleQuery({
    variables: {
      id,
      permission: {
        communityId: communityId,
      },
    },
    skip: !id || !communityId,
  });
};
