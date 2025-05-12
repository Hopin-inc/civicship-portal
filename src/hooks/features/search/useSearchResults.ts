'use client';

import { useEffect, useMemo } from 'react';
import { useHeader } from '@/components/providers/HeaderProvider';
import { useLoading } from '@/hooks/core/useLoading';
import {
  GqlOpportunityCategory as OpportunityCategory,
  GqlPublishStatus as PublishStatus,
  GqlOpportunityFilterInput as OpportunityFilterInput, useSearchOpportunitiesQuery,
} from "@/types/graphql";
import { groupOpportunitiesByDate, SearchParams } from '@/presenters/search';
import { toast } from 'sonner';
import { ActivityCard } from "@/types/opportunity";
import { presenterActivityCards } from "@/presenters/opportunity";

export const useSearchResults = (searchParams: SearchParams = {}): {
  opportunities: any;
  recommendedOpportunities: ActivityCard[];
  groupedOpportunities: { [key: string]: ActivityCard[] };
  loading: boolean;
  error: Error | null;
  hasResults: boolean;
} => {
  const { updateConfig } = useHeader();
  const { setIsLoading } = useLoading();

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
  } = useSearchOpportunitiesQuery({
    variables: {
      filter: {...buildFilter},
      first: 20,
    },
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    updateConfig({
      showSearchForm: true,
      searchParams: {
        location: searchParams.location,
        from: searchParams.from,
        to: searchParams.to,
        guests: searchParams.guests !== undefined ? parseInt(searchParams.guests) : undefined,
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
    return presenterActivityCards(opportunities.edges);
  }, [opportunities]);

  const groupedOpportunities = useMemo(() => {
    return groupOpportunitiesByDate(opportunities);
  }, [opportunities]);

  const hasResults = useMemo(() => {
    return recommendedOpportunities.length > 0;
  }, [recommendedOpportunities]);

  if (error) {
    console.error('Error fetching search results:', error);
    toast.error('検索結果の取得に失敗しました');
  }

  return {
    opportunities,
    recommendedOpportunities,
    groupedOpportunities,
    loading: queryLoading,
    error: error ?? null,
    hasResults,
  };
};

export default useSearchResults;
