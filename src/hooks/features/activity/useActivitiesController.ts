'use client';

import { useState, useCallback } from 'react';
import { useActivitiesQuery } from './useActivitiesQuery';
import { useInfiniteScroll } from '../../../hooks/core/useInfiniteScroll';
import { OpportunityConnection } from '../../../types';

/**
 * Controller hook for activities with additional UI state management
 * Combines data fetching with UI control in a more flexible way
 */
export const useActivitiesController = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'featured' | 'all'>('all');
  
  const {
    upcomingActivities,
    featuredActivities,
    allActivities,
    loading,
    error,
    fetchMore,
    hasNextPage
  } = useActivitiesQuery();

  const loadMoreRef = useInfiniteScroll({
    hasMore: hasNextPage,
    isLoading: loading,
    onLoadMore: fetchMore
  });

  const handleTabChange = useCallback((tab: 'upcoming' | 'featured' | 'all') => {
    setActiveTab(tab);
  }, []);

  const activeActivities = (() => {
    switch (activeTab) {
      case 'upcoming':
        return upcomingActivities;
      case 'featured':
        return featuredActivities;
      case 'all':
      default:
        return allActivities;
    }
  })();

  return {
    upcomingActivities,
    featuredActivities,
    allActivities,
    activeActivities,
    loading,
    error,
    
    activeTab,
    handleTabChange,
    loadMoreRef
  };
};
