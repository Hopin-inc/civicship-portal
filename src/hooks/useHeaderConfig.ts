'use client';

import { useHeader } from '../contexts/HeaderContext';
import { useCallback } from 'react';

export interface HeaderConfig {
  title?: string;
  showBackButton?: boolean;
  showLogo?: boolean;
  showSearchForm?: boolean;
}

/**
 * Custom hook to manage header configuration
 * Provides functions to update and reset header configuration
 */
export const useHeaderConfig = () => {
  const { updateConfig, resetConfig } = useHeader();

  const updateHeaderConfig = useCallback((config: HeaderConfig) => {
    updateConfig(config);
  }, [updateConfig]);

  return {
    updateConfig: updateHeaderConfig,
    resetConfig,
  };
};

export default useHeaderConfig;
