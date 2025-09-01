"use client";

import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import React from "react";
import { transformTicketClaimLinks } from "@/app/tickets/data/presenter";
import { TicketClaimLink } from "@/app/tickets/data/type";
import {
  GqlSortDirection,
  GqlTicketClaimLinksQuery,
  useTicketClaimLinksQuery,
} from "@/types/graphql";
import { useAuthStore } from "@/stores/auth-store";

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
  const { currentUser } = useAuthStore();
  const user = currentUser;
  const { data, loading, error, fetchMore, refetch } = useTicketClaimLinksQuery({
    variables: {
      filter: {
        hasAvailableTickets: true,
        issuedTo: user?.id ?? undefined,
      },
      sort: {
        createdAt: GqlSortDirection.Desc,
      },
      first: 20,
    },
    skip: !user,
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
          createdAt: GqlSortDirection.Desc,
        },
        cursor: endCursor,
        first: 20,
      },
      updateQuery: (
        prev: GqlTicketClaimLinksQuery,
        { fetchMoreResult }: { fetchMoreResult: GqlTicketClaimLinksQuery },
      ) => {
        if (!fetchMoreResult || !prev.ticketClaimLinks || !fetchMoreResult.ticketClaimLinks) {
          return prev;
        }

        return {
          ...prev,
          ticketClaimLinks: {
            ...prev.ticketClaimLinks,
            edges: [
              ...new Map(
                [
                  ...(prev.ticketClaimLinks.edges ?? []),
                  ...(fetchMoreResult.ticketClaimLinks.edges ?? []),
                ].map((edge) => [edge?.node?.id, edge]),
              ).values(),
            ],
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
