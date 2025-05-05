'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_WITH_DETAILS_AND_PORTFOLIOS } from '@/graphql/queries/user';
import { useLoading } from '@/hooks/core/useLoading';
import { toast } from 'sonner';
import { format } from 'date-fns';

type PortfolioType = 'opportunity' | 'activity_report' | 'quest';
type PortfolioCategory = 'QUEST' | 'ACTIVITY_REPORT' | 'INTERVIEW' | 'OPPORTUNITY';
type ReservationStatus = 'RESERVED' | 'CANCELED' | 'COMPLETED';

interface Portfolio {
  id: string;
  type: PortfolioType;
  title: string;
  date: string;
  location: string | null;
  category: PortfolioCategory;
  reservationStatus?: ReservationStatus | null;
  participants: Array<{
    id: string;
    name: string;
    image: string | null;
  }>;
  image: string | null;
  source?: string;
}

interface GqlPortfolio {
  id: string;
  title: string;
  category: string;
  date: string;
  thumbnailUrl: string | null;
  source?: string;
  reservationStatus?: string | null;
  place?: {
    name: string;
  } | null;
  participants: Array<{
    id: string;
    name: string;
    image: string | null;
  }>;
}

const ITEMS_PER_PAGE = 30;

const isValidPortfolioType = (category: string): category is PortfolioType => {
  return ['opportunity', 'activity_report', 'quest'].includes(category.toLowerCase());
};

const isValidPortfolioCategory = (category: string): category is PortfolioCategory => {
  return ['QUEST', 'ACTIVITY_REPORT', 'INTERVIEW', 'OPPORTUNITY'].includes(category.toUpperCase());
};

const transformPortfolio = (portfolio: GqlPortfolio): Portfolio => {
  const category = portfolio.category.toLowerCase();
  if (!isValidPortfolioType(category)) {
    console.warn(`Invalid portfolio category: ${portfolio.category}`);
  }

  const portfolioCategory = portfolio.category.toUpperCase();
  if (!isValidPortfolioCategory(portfolioCategory)) {
    console.warn(`Invalid portfolio category: ${portfolio.category}`);
  }
  
  return {
    id: portfolio.id,
    type: category as PortfolioType,
    title: portfolio.title,
    date: format(new Date(portfolio.date), 'yyyy/MM/dd'),
    location: portfolio.place?.name ?? null,
    category: portfolioCategory as PortfolioCategory,
    reservationStatus: portfolio.reservationStatus as ReservationStatus | null | undefined,
    participants: portfolio.participants.map(p => ({
      id: p.id,
      name: p.name,
      image: p.image ?? null
    })),
    image: portfolio.thumbnailUrl ?? null,
    source: portfolio.source
  };
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
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPortfolioRef = useRef<HTMLDivElement | null>(null);
  
  interface UserWithPortfoliosData {
    user?: {
      id: string;
      name: string;
      image: string | null;
      bio: string | null;
      sysRole: string | null;
      currentPrefecture: string | null;
      portfolios?: {
        edges: Array<{
          node: GqlPortfolio | null;
          cursor: string;
        }>;
        pageInfo: {
          hasNextPage: boolean;
          endCursor: string;
        };
      };
      opportunitiesCreatedByMe?: {
        edges: Array<{
          node: {
            id: string;
            title: string;
            description: string;
            images: string[];
            feeRequired?: number | null;
            isReservableWithTicket?: boolean | null;
            place?: {
              name: string;
            } | null;
            community?: {
              id: string;
              name: string;
              image: string | null;
            } | null;
          } | null;
        }>;
      };
    };
  }

  const { data, loading, error, fetchMore } = useQuery<UserWithPortfoliosData>(
    GET_USER_WITH_DETAILS_AND_PORTFOLIOS,
    {
      variables: { 
        id: userId,
        first: ITEMS_PER_PAGE,
        after: null,
        filter: null,
        sort: { date: "DESC" }
      },
      fetchPolicy: "network-only",
      skip: !userId
    }
  );

  useEffect(() => {
    setIsLoading(loading);
  }, [loading, setIsLoading]);

  useEffect(() => {
    if (data?.user?.portfolios?.edges) {
      const initialPortfolios = data.user.portfolios.edges
        .map((edge: { node: GqlPortfolio | null; cursor: string }) => edge?.node)
        .filter((node: GqlPortfolio | null): node is GqlPortfolio => node != null)
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
      (edge: { node: GqlPortfolio | null; cursor: string }) => edge?.node?.id === lastPortfolio.id
    )?.cursor;

    try {
      const { data: moreData } = await fetchMore({
        variables: {
          id: userId,
          first: ITEMS_PER_PAGE,
          after: lastCursor,
          filter: null,
          sort: { date: "DESC" }
        }
      });

      if (moreData?.user?.portfolios?.edges) {
        const newPortfolios = moreData.user.portfolios.edges
          .map((edge: { node: GqlPortfolio | null; cursor: string }) => edge?.node)
          .filter((node: GqlPortfolio | null): node is GqlPortfolio => node != null)
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

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (lastPortfolioRef.current) {
      observer.current.observe(lastPortfolioRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, isLoadingMore, portfolios.length, loadMore]);

  const handleError = useCallback(() => {
    if (error) {
      console.error('Error fetching user portfolios:', error);
      toast.error('ポートフォリオの取得に失敗しました');
    }
  }, [error]);

  useEffect(() => {
    handleError();
  }, [handleError]);

  const getActiveOpportunities = () => {
    return data?.user?.opportunitiesCreatedByMe?.edges?.map((edge: { 
      node: {
        id: string;
        title: string;
        description: string;
        images: string[];
        feeRequired?: number | null;
        isReservableWithTicket?: boolean | null;
        place?: { name: string } | null;
        community?: {
          id: string;
          name: string;
          image: string | null;
        } | null;
      } | null;
    }) => {
      const node = edge?.node;
      if (!node) return null;
      return {
        id: node.id,
        title: node.title,
        price: node.feeRequired ?? null,
        location: node.place?.name ?? '',
        imageUrl: node.images?.[0] ?? null,
        community: node.community,
        isReservableWithTicket: node.isReservableWithTicket
      };
    }).filter(Boolean) ?? [];
  };

  return {
    portfolios,
    isLoading: loading,
    isLoadingMore,
    hasMore,
    error,
    lastPortfolioRef,
    loadMore,
    activeOpportunities: getActiveOpportunities(),
    userData: data?.user
  };
};

export default useUserPortfolios;
