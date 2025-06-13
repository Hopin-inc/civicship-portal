"use client";

import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { useGetArticleQuery } from "@/types/graphql";

export const useArticleQuery = (id: string) => {
  console.log("communityId", COMMUNITY_ID);

  return useGetArticleQuery({
    variables: {
      id,
      permission: {
        communityId: COMMUNITY_ID ?? "",
      },
    },
    skip: !id,
  });
};
