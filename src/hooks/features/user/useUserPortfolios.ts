'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLoading } from '@/hooks/core/useLoading';
import { toast } from 'sonner';
import { useUserPortfolioQuery,  GqlPortfolio } from './useUserPortfolioQuery';
import { useUserOpportunities } from './useUserOpportunities';
import { Portfolio, transformPortfolio } from '@/transformers/portfolio';
import { SortDirection } from "@/gql/graphql";

/**
 * Custom hook for implementing infinite scrolling
 */
const useInfiniteScroll = ({
  hasMore,
  isLoading,
  onLoadMore,
}: {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (targetRef.current) {
      observer.current.observe(targetRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, isLoading, onLoadMore]);

  return targetRef;
};

/**
 * Custom hook for fetching and managing user portfolios
 * @param userId User ID to fetch portfolios for
 */
export const useUserPortfolios = (userId: string) => {
  const { setIsLoading } = useLoading();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const { data, loading, error, fetchMore } = useUserPortfolioQuery(userId);
  
  useEffect(() => {
    setIsLoading(loading);
  }, [loading, setIsLoading]);

  useEffect(() => {
    if (data?.user?.portfolios?.edges) {
      const initialPortfolios = data.user.portfolios.edges
        .map((edge: any) => edge?.node)
        .filter((node: any): node is GqlPortfolio => node != null)
        .map(transformPortfolio);
      
      setPortfolios(initialPortfolios);
      setHasMore(data.user.portfolios.pageInfo.hasNextPage);
    }
  }, [data]);

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore) {
      return;
    }

    setIsLoadingMore(true);
    const lastPortfolio = portfolios[portfolios.length - 1];
    const lastCursor = data?.user?.portfolios?.edges?.find(
      (edge: any) => edge?.node?.id === lastPortfolio.id
    )?.cursor;

    try {
      const { data: moreData } = await fetchMore({
        variables: {
          id: userId,
          first: 30,
          after: lastCursor,
          filter: null,
          sort: { date: SortDirection.Desc }
        }
      });

      if (moreData?.user?.portfolios?.edges) {
        const newPortfolios = moreData.user.portfolios.edges
          .map((edge: any) => edge?.node)
          .filter((node: any): node is GqlPortfolio => node != null)
          .map(transformPortfolio);

        setPortfolios(prev => [...prev, ...newPortfolios]);
        
        const newHasMore = moreData.user.portfolios.pageInfo.hasNextPage;
        setHasMore(newHasMore);
      }
    } catch (error) {
      console.error('Error loading more portfolios:', error);
      toast.error('ポートフォリオの読み込みに失敗しました');
    } finally {
      setIsLoadingMore(false);
    }
  }, [fetchMore, hasMore, isLoadingMore, userId, portfolios, data]);

  const lastPortfolioRef = useInfiniteScroll({
    hasMore,
    isLoading: isLoadingMore,
    onLoadMore: loadMore
  });

  const handleError = useCallback(() => {
    if (error) {
      console.error('Error fetching user portfolios:', error);
      toast.error('ポートフォリオの取得に失敗しました');
    }
  }, [error]);

  useEffect(() => {
    handleError();
  }, [handleError]);

  const activeOpportunities = useUserOpportunities(data);

  return {
    portfolios,
    isLoading: loading,
    isLoadingMore,
    hasMore,
    error,
    lastPortfolioRef,
    loadMore,
    activeOpportunities,
    userData: data?.user
  };
};

export default useUserPortfolios;
