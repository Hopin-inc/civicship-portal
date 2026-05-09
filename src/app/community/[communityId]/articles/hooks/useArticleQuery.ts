"use client";

import { useGetArticleQuery } from "@/types/graphql";

export const useArticleQuery = (id: string) => {
  return useGetArticleQuery({
    variables: { id },
    skip: !id,
  });
};
