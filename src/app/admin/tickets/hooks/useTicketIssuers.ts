"use client";

import { useInfiniteScrollQuery } from "@/hooks/useInfiniteScrollQuery";
import {
  GqlSortDirection,
} from "@/types/graphql";
import { useAuth } from "@/contexts/AuthProvider";
import { GET_TICKET_ISSUERS } from "@/graphql/reward/ticketIssuer/query";

export interface UseTicketIssuersResult {
  ticketIssuers: any[];
  loading: boolean;
  error: any;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  refetch: () => void;
  hasNextPage: boolean;
  isLoadingMore: boolean;
}

export const useTicketIssuers = (): UseTicketIssuersResult => {
  const { user } = useAuth();

  const {
    loading,
    error,
    loadMoreRef,
    refetch,
    hasNextPage,
    isLoadingMore,
    edges: ticketIssuers,
  } = useInfiniteScrollQuery(GET_TICKET_ISSUERS, {
    variables: {
      filter: { ownerId: user?.id ?? "" },
      sort: { createdAt: GqlSortDirection.Desc },
      first: 10,
    },
    connectionKey: "ticketIssuers",
    onError: () => "チケットの読み込みに失敗しました。",
  });

  return {
    ticketIssuers,
    loading,
    error,
    loadMoreRef,
    refetch,
    hasNextPage,
    isLoadingMore,
  };
}; 