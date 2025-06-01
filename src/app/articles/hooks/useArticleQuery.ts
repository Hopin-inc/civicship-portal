'use client';

import { COMMUNITY_ID } from '@/utils';
import { useGetArticleQuery } from "@/types/graphql";
import clientLogger from "@/lib/logging/client";

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
      clientLogger.info('Article query error', {
        error: error instanceof Error ? error.message : String(error),
        component: 'useArticleQuery',
        articleId: id
      });
    },
  });
};
