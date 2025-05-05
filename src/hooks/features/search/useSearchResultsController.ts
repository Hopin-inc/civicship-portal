'use client';

import { useEffect } from 'react';
import { useHeader } from '@/contexts/HeaderContext';
import { useLoading } from '@/hooks/core/useLoading';
import { 
  GqlOpportunityCategory as OpportunityCategory, 
  GqlPublishStatus as PublishStatus, 
  GqlOpportunityFilterInput as OpportunityFilterInput, 
  GqlOpportunityEdge as OpportunityEdge, 
  GqlOpportunity as GraphQLOpportunity 
} from '@/types/graphql';
import { OpportunityCardProps } from '@/components/features/opportunity/OpportunityCard';
import { useSearchResultsQuery } from './useSearchResultsQuery';
import { 
  mapNodeToCardProps, 
  transformRecommendedOpportunities, 
  groupOpportunitiesByDate 
} from '@/transformers/search';

export interface SearchParams {
  location?: string;
  from?: string;
  to?: string;
  guests?: string;
  type?: 'activity' | 'quest';
  ticket?: string;
  q?: string;
}

/**
 * Controller hook for managing search results
 */
export const useSearchResultsController = (searchParams: SearchParams = {}) => {
  const { updateConfig } = useHeader();
  const { setIsLoading } = useLoading();

  /**
   * Build filter for GraphQL query based on search parameters
   */
  const buildFilter = (): OpportunityFilterInput => {
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
        filter.slotStartsAt = fromDate.toISOString() as any;
      }

      if (searchParams.to) {
        const toDate = new Date(searchParams.to);
        toDate.setUTCHours(23, 59, 59, 999);
        filter.slotEndsAt = toDate.toISOString() as any;
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
  };

  const {
    data,
    loading: queryLoading,
    error,
  } = useSearchResultsQuery(buildFilter());

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

  const opportunities = data?.opportunities || { edges: [], pageInfo: { hasNextPage: false, endCursor: null } };

  const recommendedOpportunities = transformRecommendedOpportunities(opportunities);
  const groupedOpportunities = groupOpportunitiesByDate(opportunities);

  return {
    opportunities,
    recommendedOpportunities,
    groupedOpportunities,
    loading: queryLoading,
    error,
  };
};
