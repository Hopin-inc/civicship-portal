'use client';

import { useQuery } from '@apollo/client';
import { GetParticipationDocument } from '../../../graphql/queries/participation';
import type { GetParticipationQuery, GetParticipationQueryVariables } from '../../../gql/graphql';

/**
 * Hook for fetching participation data from GraphQL
 * @param id Participation ID to fetch
 */
export const useParticipationQuery = (id: string) => {
  return useQuery<GetParticipationQuery, GetParticipationQueryVariables>(
    GetParticipationDocument,
    {
      variables: { id },
      skip: !id,
      fetchPolicy: "network-only",
    }
  );
};
