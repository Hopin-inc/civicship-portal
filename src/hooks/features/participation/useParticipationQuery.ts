'use client';

import { useQuery } from '@apollo/client';
import { GetParticipationDocument } from '@/graphql/experience/participation/query';
import type { GqlGetParticipationQuery, GqlGetParticipationQueryVariables } from '@/types/graphql';

/**
 * Hook for fetching participation data from GraphQL
 * @param id Participation ID to fetch
 */
export const useParticipationQuery = (id: string) => {
  return useQuery<GqlGetParticipationQuery, GqlGetParticipationQueryVariables>(
    GetParticipationDocument,
    {
      variables: { id },
      skip: !id,
      fetchPolicy: "network-only",
    }
  );
};
