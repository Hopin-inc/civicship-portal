'use client';

import { useEffect, useMemo } from 'react';
import { useHeader } from '@/components/providers/HeaderProvider';
import { useLoading } from '@/hooks/core/useLoading';
import { 
  GqlOpportunityCategory as OpportunityCategory, 
  GqlPublishStatus as PublishStatus, 
  GqlOpportunityFilterInput as OpportunityFilterInput
} from '@/types/graphql';
import { OpportunityCardProps } from '@/components/features/opportunity/OpportunityCard';
import { useSearchResultsQuery } from './useSearchResultsQuery';
import { 
  mapNodeToCardProps, 
  transformRecommendedOpportunities, 
  groupOpportunitiesByDate,
  SearchParams
} from '@/presenters/search';
import { ErrorWithMessage, formatError } from '../wallet/useWalletController';
import { toast } from 'sonner';

/**
 * Controller hook for managing search results
 * Handles business logic and state management for search results
 */
export const useSearchResultsController = (searchParams: SearchParams = {}): {
  opportunities: any;
  recommendedOpportunities: OpportunityCardProps[];
  groupedOpportunities: { [key: string]: OpportunityCardProps[] };
  loading: boolean;
  error: ErrorWithMessage | null;
  hasResults: boolean;
} => {
  const { updateConfig } = useHeader();
  const { setIsLoading } = useLoading();

  /**
   * Build filter for GraphQL query based on search parameters
   */
  const buildFilter = useMemo((): OpportunityFilterInput => {
    const filter: OpportunityFilterInput = {
      publishStatus: [PublishStatus.Public],
    };

    if (searchParams.type === 'activity') {
      filter.category = OpportunityCategory.Activity;
    } else if (searchParams.type === 'quest') {
      filter.category = OpportunityCategory.Quest;
    }

    if (searchParams.location) {
      filter.cityCodes = [searchParams.location];
    }

    if (searchParams.from || searchParams.to) {
      if (searchParams.from) {
        const fromDate = new Date(searchParams.from);
        fromDate.setUTCHours(0, 0, 0, 0);
        (filter as any).slotStartsAt = fromDate.toISOString();
      }

      if (searchParams.to) {
        const toDate = new Date(searchParams.to);
        toDate.setUTCHours(23, 59, 59, 999);
        (filter as any).slotEndsAt = toDate.toISOString();
      }
    }

    if (searchParams.guests) {
      const guestCount = parseInt(searchParams.guests, 10);
      if (!isNaN(guestCount) && guestCount > 0) {
        filter.slotRemainingCapacity = guestCount;
      }
    }

    if (searchParams.ticket === 'true') {
      (filter as any).isReservableWithTicket = true;
    }

    if (searchParams.q) {
      (filter as any).searchQuery = searchParams.q;
    }

    return filter;
  }, [searchParams]);

  const {
    data,
    loading: queryLoading,
    error,
  } = useSearchResultsQuery(buildFilter);

  useEffect(() => {
    updateConfig({
      showSearchForm: true,
      searchParams: {
        location: searchParams.location,
        from: searchParams.from,
        to: searchParams.to,
        guests: searchParams.guests,
      },
      showLogo: false,
      showBackButton: true,
    });
  }, [
    searchParams.location,
    searchParams.from,
    searchParams.to,
    searchParams.guests,
    updateConfig,
  ]);

  useEffect(() => {
    setIsLoading(queryLoading && !data);
  }, [queryLoading, data, setIsLoading]);

  const opportunities = useMemo(() => {
    return data?.opportunities || { edges: [], pageInfo: { hasNextPage: false, endCursor: null } };
  }, [data]);

  const recommendedOpportunities = useMemo(() => {
    return transformRecommendedOpportunities(opportunities);
  }, [opportunities]);
  
  const groupedOpportunities = useMemo(() => {
    return groupOpportunitiesByDate(opportunities);
  }, [opportunities]);

  const hasResults = useMemo(() => {
    return recommendedOpportunities.length > 0;
  }, [recommendedOpportunities]);

  const formattedError = useMemo(() => {
    if (error) {
      console.error('Error fetching search results:', error);
      toast.error('検索結果の取得に失敗しました');
      return formatError(error);
    }
    return null;
  }, [error]);

  return {
    opportunities,
    recommendedOpportunities,
    groupedOpportunities,
    loading: queryLoading,
    error: formattedError,
    hasResults,
  };
};
