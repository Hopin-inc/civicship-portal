'use client';

import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { 
  GqlOpportunityEdge, 
  GqlOpportunity as GraphQLOpportunity 
} from '@/types/graphql';
import { ActivityCard } from "@/types/opportunity";

export interface SearchParams {
  location?: string;
  from?: string;
  to?: string;
  guests?: string;
  type?: 'activity' | 'quest';
  ticket?: string;
  q?: string;
}

export const formatDateRange = (range: DateRange | undefined): string => {
  if (!range?.from) return '';
  if (!range.to) return format(range.from, 'M/d', { locale: ja });
  return `${format(range.from, 'M/d', { locale: ja })} - ${format(range.to, 'M/d', { locale: ja })}`;
};

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

export const mapNodeToCardProps = (node: GraphQLOpportunity): ActivityCard => ({
  id: node.id,
  title: node.title,
  category: node.category,
  feeRequired: node.feeRequired || 0,
  location: node.place?.name || '場所未定',
  images: node.images || [],
  communityId: node.community?.id || "",
  hasReservableTicket: node.isReservableWithTicket || false,
});

export const groupOpportunitiesByDate = (opportunities: { edges: GqlOpportunityEdge[] }): { [key: string]: ActivityCard[] } => {
  return opportunities.edges.reduce(
    (acc: { [key: string]: ActivityCard[] }, edge: GqlOpportunityEdge) => {
      if (!edge?.node?.slots?.[0]?.startsAt) return acc;
      
      const dateKey = format(new Date(edge.node.slots[0].startsAt), 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(mapNodeToCardProps(edge.node));
      return acc;
    },
    {},
  );
};
