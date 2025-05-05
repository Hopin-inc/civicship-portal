'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useHeader } from '@/contexts/HeaderContext';
import { useLoading } from '@/hooks/useLoading';
import { SEARCH_OPPORTUNITIES } from '@/graphql/queries/search';
import { 
  OpportunityCategory, 
  PublishStatus, 
  OpportunityFilterInput, 
  OpportunityEdge, 
  Opportunity as GraphQLOpportunity 
} from '@/gql/graphql';
import { OpportunityCardProps } from '@/app/components/features/opportunity/OpportunityCard';

interface SearchParams {
  location?: string;
  from?: string;
  to?: string;
  guests?: string;
  type?: 'activity' | 'quest';
  ticket?: string;
  q?: string;
}

/**
 * Custom hook for managing search results
 */
export const useSearchResults = (searchParams: SearchParams = {}) => {
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
      filter.isReservableWithTicket = true;
    }

    if (searchParams.q) {
      filter.searchQuery = searchParams.q;
    }

    return filter;
  };

  const {
    data,
    loading: queryLoading,
    error,
  } = useQuery(SEARCH_OPPORTUNITIES, {
    variables: {
      filter: buildFilter(),
      first: 20,
    },
    fetchPolicy: 'network-only',
  });

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

  /**
   * Map GraphQL opportunity node to card props
   */
  const mapNodeToCardProps = (node: GraphQLOpportunity): OpportunityCardProps => ({
    id: node.id,
    title: node.title,
    price: node.feeRequired || null,
    location: node.place?.name || '場所未定',
    imageUrl: node.images?.[0] || null,
    community: node.community ? { id: node.community.id } : undefined,
    isReservableWithTicket: node.isReservableWithTicket || false,
  });

  const opportunities = data?.opportunities || { edges: [], pageInfo: { hasNextPage: false, endCursor: null } };

  const recommendedOpportunities = opportunities.edges
    .filter((edge: OpportunityEdge) => edge?.node?.slots?.edges?.[0]?.node?.startsAt)
    .map((edge: OpportunityEdge) => edge.node && mapNodeToCardProps(edge.node))
    .filter(Boolean) as OpportunityCardProps[];

  const groupedOpportunities = opportunities.edges.reduce(
    (acc: { [key: string]: OpportunityCardProps[] }, edge: OpportunityEdge) => {
      if (!edge?.node?.slots?.edges?.[0]?.node?.startsAt) return acc;
      
      const dateKey = format(new Date(edge.node.slots.edges[0].node.startsAt), 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(mapNodeToCardProps(edge.node));
      return acc;
    },
    {},
  );

  return {
    opportunities,
    recommendedOpportunities,
    groupedOpportunities,
    loading: queryLoading,
    error,
  };
};

export default useSearchResults;
