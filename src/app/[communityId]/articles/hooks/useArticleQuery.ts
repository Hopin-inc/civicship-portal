"use client";

import { useParams } from "next/navigation";
import { useGetArticleQuery } from "@/types/graphql";

export const useArticleQuery = (id: string) => {
  const params = useParams();
  const communityId = params.communityId as string;
  
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
