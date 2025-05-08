'use client';

import { useMemo } from 'react';
import { useActivitiesQuery } from './useActivitiesQuery';
import { transformActivity } from '../../../transformers/activity';
import type { Activity } from '../../../transformers/activity';

/**
 * Controller hook for activities
 * Handles business logic and state management
 */
export const useActivitiesController = (options = {}) => {
  const { data, loading, error } = useActivitiesQuery(options);
  
  const activities = useMemo(() => {
    if (!data?.activities?.edges) return [];
    
    return data.activities.edges
      .filter((edge: any) => edge?.node)
      .map((edge: any) => transformActivity(edge.node));
  }, [data]);
  
  return {
    activities,
    loading,
    error,
  };
};
