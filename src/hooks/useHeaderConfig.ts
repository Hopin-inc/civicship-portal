'use client';

import { useEffect } from 'react';
import { useHeader } from '../contexts/HeaderContext';

interface HeaderConfig {
  title?: string;
  showBackButton?: boolean;
  showLogo?: boolean;
  showSearchForm?: boolean;
  action?: React.ReactNode;
}

export const useHeaderConfig = (config: HeaderConfig) => {
  const { updateConfig, resetConfig } = useHeader();
  
  useEffect(() => {
    updateConfig(config);
    
    return () => {
      resetConfig();
    };
  }, [updateConfig, resetConfig, config]);
};
