'use client';

import { COMMUNITY_ID } from '@/utils';
import { useGetArticleQuery } from "@/types/graphql";
import { logger } from "@/lib/logging";

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
      logger.info('Article query error', {
        error: error instanceof Error ? error.message : String(error),
        component: 'useArticleQuery',
        articleId: id
      });
    },
  });
};
