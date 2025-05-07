'use client';

import { useQuery } from '@apollo/client';
import { GET_ARTICLE } from '@/graphql/queries/article';
import { COMMUNITY_ID } from '@/utils';

/**
 * Hook for fetching article data from GraphQL
 */
export const useArticleQuery = (id: string) => {
  return useQuery(GET_ARTICLE, {
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
