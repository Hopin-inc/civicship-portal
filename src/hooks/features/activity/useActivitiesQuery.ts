'use client';

import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

export const GET_ACTIVITIES = gql`
  query GetActivities($filter: ActivityFilter, $sort: ActivitySort, $first: Int) {
    activities(filter: $filter, sort: $sort, first: $first) {
      edges {
        node {
          id
          description
          remark
          startsAt
          endsAt
          isPublic
          event {
            id
            description
          }
          user {
            id
            firstName
            middleName
            lastName
          }
          organization {
            id
            name
          }
        }
      }
    }
  }
`;

/**
 * Hook for fetching activities data
 */
export const useActivitiesQuery = (options = {}) => {
  const { data, loading, error } = useQuery(GET_ACTIVITIES, {
    variables: {
      filter: { isPublic: true },
      sort: { startsAt: 'DESC' },
      first: 10,
    },
    fetchPolicy: "no-cache",
    ...options
  });
  
  return { data, loading, error };
};
