"use client";

import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { useGetArticleQuery } from "@/types/graphql";

export const useArticleQuery = (id: string) => {
  const { communityId } = useCommunityConfig();
  
  return useGetArticleQuery({
    variables: {
      id,
      permission: {
        communityId: communityId ?? "",
      },
    },
    skip: !id,
  });
};
