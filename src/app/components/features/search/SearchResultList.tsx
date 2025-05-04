'use client';

import React from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import RecommendedOpportunities from './RecommendedOpportunities';
import DateGroupedOpportunities from './DateGroupedOpportunities';
import EmptySearchResults from './EmptySearchResults';
import { OpportunityCardProps } from '../opportunity/OpportunityCard';

interface SearchResultListProps {
  recommendedOpportunities: OpportunityCardProps[];
  groupedOpportunities: Record<string, OpportunityCardProps[]>;
  searchQuery?: string;
}

/**
 * Component to display search results
 */
export const SearchResultList: React.FC<SearchResultListProps> = ({
  recommendedOpportunities,
  groupedOpportunities,
  searchQuery
}) => {
  const hasResults = recommendedOpportunities.length > 0 || Object.keys(groupedOpportunities).length > 0;

  if (!hasResults) {
    return <EmptySearchResults searchQuery={searchQuery} />;
  }

  return (
    <div className="space-y-12">
      <RecommendedOpportunities opportunities={recommendedOpportunities} />
      <DateGroupedOpportunities groupedOpportunities={groupedOpportunities} />
    </div>
  );
};

export default SearchResultList;
