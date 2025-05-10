'use client';

import { COMMUNITY_ID } from '@/utils';
import { useGetArticleQuery } from "@/types/graphql";

export const useArticleQuery = (id: string) => {
  return useGetArticleQuery({
    variables: {
      id,
      permission: {
        communityId: COMMUNITY_ID
      }
    },
    skip: !id,
    onError: (error) => {
      console.error('Article query error:', error);
    },
  });
};
