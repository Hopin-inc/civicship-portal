'use client';

import { useActivitiesController } from './useActivitiesController';

/**
 * Public API hook for activities
 * This is the hook that should be used by components
 */
export const useActivities = (options = {}) => {
  return useActivitiesController(options);
};
