'use client';

import { useEffect, useCallback } from 'react';
import { useHeader } from '@/contexts/HeaderContext';

/**
 * Header configuration interface
 */
export interface HeaderConfig {
  title?: string;
  showBackButton?: boolean;
  showLogo?: boolean;
  showSearchForm?: boolean;
  action?: React.ReactNode;
  backTo?: string; // 戻るボタンのカスタム遷移先
  searchParams?: {
    location?: string;
    from?: string;
    to?: string;
    guests?: number;
  };
}

/**
 * Custom hook to manage header configuration
 * Provides functions to update and reset header configuration
 * Can be used in two ways:
 * 1. With a config parameter to automatically apply config on mount and reset on unmount
 * 2. Without parameters to get update and reset functions for manual control
 */
export const useHeaderConfig = (config?: HeaderConfig) => {
  const { updateConfig, resetConfig, lastVisitedUrls } = useHeader();
  
  const updateHeaderConfig = useCallback((newConfig: HeaderConfig) => {
    updateConfig(newConfig);
  }, [updateConfig]);
  
  useEffect(() => {
    if (config) {
      updateConfig(config);
      
      return () => {
        resetConfig();
      };
    }
  }, [updateConfig, resetConfig, config]);
  
  return {
    updateConfig: updateHeaderConfig,
    resetConfig,
    lastVisitedUrls
  };
};

export default useHeaderConfig;
