'use client';

import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { 
  GqlOpportunityEdge, 
  GqlOpportunity as GraphQLOpportunity 
} from '@/types/graphql';
import { OpportunityCardProps } from "@/components/features/opportunity/OpportunityCard";

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
 * Format date range for display
 */
export const formatDateRange = (range: DateRange | undefined): string => {
  if (!range?.from) return '';
  if (!range.to) return format(range.from, 'M/d', { locale: ja });
  return `${format(range.from, 'M/d', { locale: ja })} - ${format(range.to, 'M/d', { locale: ja })}`;
};

/**
 * Build search params from search state
 */
export const buildSearchParams = (
  searchQuery: string,
  location: string,
  dateRange: DateRange | undefined,
  guests: number,
  useTicket: boolean,
  selectedTab: string
): URLSearchParams => {
  const params = new URLSearchParams();
  if (searchQuery) params.set('q', searchQuery);
  if (location) params.set('location', location);
  if (dateRange?.from) params.set('from', dateRange.from.toISOString());
  if (dateRange?.to) params.set('to', dateRange.to.toISOString());
  if (guests > 0) params.set('guests', guests.toString());
  if (useTicket) params.set('ticket', 'true');
  params.set('type', selectedTab);
  
  return params;
};

/**
 * Map GraphQL opportunity node to card props
 */
export const mapNodeToCardProps = (node: GraphQLOpportunity): OpportunityCardProps => ({
  id: node.id,
  title: node.title,
  price: node.feeRequired || null,
  location: node.place?.name || '場所未定',
  imageUrl: node.images?.[0] || null,
  community: node.community ? { id: node.community.id } : undefined,
  isReservableWithTicket: node.isReservableWithTicket || false,
});

/**
 * Transform opportunities into recommended opportunities
 */
export const transformRecommendedOpportunities = (opportunities: { edges: GqlOpportunityEdge[] }): OpportunityCardProps[] => {
  return opportunities.edges
    .filter((edge: GqlOpportunityEdge) => edge?.node?.slots?.edges?.[0]?.node?.startsAt)
    .map((edge: GqlOpportunityEdge) => edge.node && mapNodeToCardProps(edge.node))
    .filter(Boolean) as OpportunityCardProps[];
};

/**
 * Group opportunities by date
 */
export const groupOpportunitiesByDate = (opportunities: { edges: GqlOpportunityEdge[] }): { [key: string]: OpportunityCardProps[] } => {
  return opportunities.edges.reduce(
    (acc: { [key: string]: OpportunityCardProps[] }, edge: GqlOpportunityEdge) => {
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
};
