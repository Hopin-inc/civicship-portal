"use client";

import React, { useState, useEffect, useRef } from "react";
import { GqlTransaction, GqlTransactionsConnection } from "@/types/graphql";
import { toast } from "react-toastify";

interface UseInfiniteTransactionsProps {
  initialTransactions: GqlTransactionsConnection;
  fetchMore: (cursor: string, first: number) => Promise<GqlTransactionsConnection>;
}

interface UseInfiniteTransactionsReturn {
  transactions: GqlTransaction[];
  hasNextPage: boolean;
  loading: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  loadMore: () => Promise<void>;
}

export const useInfiniteTransactions = ({
  initialTransactions,
  fetchMore,
}: UseInfiniteTransactionsProps): UseInfiniteTransactionsReturn => {
  const [transactions, setTransactions] = useState<GqlTransaction[]>(
    (initialTransactions.edges?.map(edge => edge?.node) ?? []).filter(Boolean) as GqlTransaction[]
  );
  const [hasNextPage, setHasNextPage] = useState(initialTransactions.pageInfo?.hasNextPage ?? false);
  const [endCursor, setEndCursor] = useState(initialTransactions.pageInfo?.endCursor ?? null);
  const [loading, setLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const loadMore = React.useCallback(async () => {
    if (loading || !hasNextPage || !endCursor) return;

    setLoading(true);
    
    try {
      const data = await fetchMore(endCursor, 20);
      
      const newTransactions = (data.edges?.map(edge => edge?.node) ?? []).filter(Boolean) as GqlTransaction[];
      
      setTransactions(prev => [...prev, ...newTransactions]);
      setHasNextPage(data.pageInfo?.hasNextPage ?? false);
      setEndCursor(data.pageInfo?.endCursor ?? null);
    } catch (error) {
      console.error('Error loading more transactions:', error);
      toast.error('データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  }, [loading, hasNextPage, endCursor, fetchMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, loading, loadMore]);

  return {
    transactions,
    hasNextPage,
    loading,
    loadMoreRef,
    loadMore,
  };
};
