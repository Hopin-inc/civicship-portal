"use client";

import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import React from "react";
import { gql, useQuery } from "@apollo/client";
import { transformTicketClaimLinks } from "@/app/tickets/data/presenter";
import { TicketClaimLink } from "@/app/tickets/data/type";
import {
  GqlClaimLinkStatus,
  GqlSortDirection,
  GqlPageInfo
} from "@/types/graphql";
import { useAuth } from "@/contexts/AuthProvider";

export type GqlTicketClaimLinksQueryVariables = {
  filter?: {
    status?: GqlClaimLinkStatus;
    issuerId?: string;
    issuedTo?: string;
    hasAvailableTickets?: boolean;
  };
  sort?: {
    createdAt?: GqlSortDirection;
    status?: GqlSortDirection;
  };
  cursor?: string;
  first?: number;
};

export type GqlTicketClaimLinksQuery = {
  ticketClaimLinks: {
    edges: Array<{
      node: {
        id: string;
        status: GqlClaimLinkStatus;
        qty: number;
        claimedAt?: Date | null;
        createdAt?: Date | null;
        issuer?: {
          id: string;
          owner?: {
            id: string;
            name: string;
            image: string | null;
          };
        };
      };
      cursor: string;
    }>;
    pageInfo: GqlPageInfo;
    totalCount: number;
  };
};

const TICKET_CLAIM_LINKS_QUERY = gql`
  query ticketClaimLinks(
    $filter: TicketClaimLinkFilterInput
    $sort: TicketClaimLinkSortInput
    $cursor: String
    $first: Int
  ) {
    ticketClaimLinks(
      filter: $filter
      sort: $sort
      cursor: $cursor
      first: $first
    ) {
      edges {
        node {
          id
          status
          qty
          claimedAt
          createdAt
          issuer {
            id
            owner {
              id
              name
              image
            }
          }
          tickets {
            status
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export interface UseTicketClaimLinksResult {
  ticketClaimLinks: TicketClaimLink[];
  loading: boolean;
  error: any;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  refetch: () => void;
  hasNextPage: boolean;
}

const fallbackConnection = {
  edges: [],
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
  },
  totalCount: 0,
};

export const useTicketClaimLinks = (): UseTicketClaimLinksResult => {
  const { user } = useAuth();
  const { data, loading, error, fetchMore, refetch } = useQuery<
    GqlTicketClaimLinksQuery,
    GqlTicketClaimLinksQueryVariables
  >(TICKET_CLAIM_LINKS_QUERY, {
    variables: {
      filter: {
        hasAvailableTickets: true,
        issuedTo: user?.id ?? undefined,
      },
      sort: {
        createdAt: "desc" as GqlSortDirection,
      },
      first: 20,
    },
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  const connection = data?.ticketClaimLinks ?? fallbackConnection;
  const endCursor = connection.pageInfo?.endCursor;
  const hasNextPage = connection.pageInfo?.hasNextPage ?? false;

  const handleFetchMore = async () => {
    if (!hasNextPage) return;

    await fetchMore({
      variables: {
        filter: {
          hasAvailableTickets: true,
        },
        sort: {
          createdAt: "desc",
        },
        cursor: endCursor,
        first: 20,
      },
      updateQuery: (prev: GqlTicketClaimLinksQuery, { fetchMoreResult }: { fetchMoreResult: GqlTicketClaimLinksQuery }) => {
        if (!fetchMoreResult || !prev.ticketClaimLinks || !fetchMoreResult.ticketClaimLinks) {
          return prev;
        }

        return {
          ...prev,
          ticketClaimLinks: {
            ...prev.ticketClaimLinks,
            edges: [...prev.ticketClaimLinks.edges, ...fetchMoreResult.ticketClaimLinks.edges],
            pageInfo: fetchMoreResult.ticketClaimLinks.pageInfo,
          },
        };
      },
    });
  };

  const loadMoreRef = useInfiniteScroll({
    hasMore: hasNextPage,
    isLoading: loading,
    onLoadMore: handleFetchMore,
  });

  const ticketClaimLinks = transformTicketClaimLinks(connection);

  return {
    ticketClaimLinks,
    loading,
    error,
    loadMoreRef,
    refetch,
    hasNextPage,
  };
};
