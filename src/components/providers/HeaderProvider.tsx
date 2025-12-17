"use client";

import React, { ReactNode, useState, useEffect, createContext, useContext, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";

export interface HeaderConfig {
  title?: string;
  showBackButton?: boolean;
  showLogo?: boolean;
  showSearchForm?: boolean;
  action?: React.ReactNode;
  backTo?: string;
  hideHeader?: boolean; // ヘッダー全体を非表示にする
  searchParams?: {
    location?: string;
    from?: string;
    to?: string;
    guests?: number;
    q?: string;
    type?: string;
    ticket?: string;
    points?: string;
  };
}

export type HeaderContextState = {
  config: HeaderConfig;
  updateConfig: (config: Partial<HeaderConfig>) => void;
  resetConfig: () => void;
  lastVisitedUrls: Record<string, string>;
  addToHistory: (pageType: string, url: string) => void;
};

const defaultConfig: HeaderConfig = {
  title: undefined,
  showBackButton: false,
  showLogo: true,
  showSearchForm: false,
  action: undefined,
  backTo: undefined,
  hideHeader: false,
  searchParams: undefined,
};

export const HeaderContext = createContext<HeaderContextState>({
  config: defaultConfig,
  updateConfig: () => {},
  resetConfig: () => {},
  lastVisitedUrls: {},
  addToHistory: () => {},
});

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
};

const PAGE_TYPES = {
  ACTIVITIES: "activities",
  SEARCH: "search",
  PLACES: "places",
  USER: "user",
  HOME: "home",
};

const HeaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<HeaderConfig>(defaultConfig);
  const [lastVisitedUrls, setLastVisitedUrls] = useState<Record<string, string>>({});
  const pathname = usePathname();

  const updateConfig = useCallback((newConfig: Partial<HeaderConfig>) => {
    setConfig((prevConfig: HeaderConfig) => ({
      ...prevConfig,
      ...newConfig,
      searchParams: {
        ...prevConfig.searchParams,
        ...newConfig.searchParams,
      },
    }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(defaultConfig);
  }, []);

  const getPageType = useCallback((path: string): string => {
    if (path.startsWith("/activities")) {
      return PAGE_TYPES.ACTIVITIES;
    } else if (path.startsWith("/search")) {
      return PAGE_TYPES.SEARCH;
    } else if (path.startsWith("/places")) {
      return PAGE_TYPES.PLACES;
    } else if (path.startsWith("/users") || path.startsWith("/wallets") || path.startsWith("/tickets")) {
      return PAGE_TYPES.USER;
    }
    return PAGE_TYPES.HOME;
  }, []);

  const addToHistory = useCallback((pageType: string, url: string) => {
    setLastVisitedUrls((prev: Record<string, string>) => {
      if (url !== prev[pageType]) {
        return { ...prev, [pageType]: url };
      }
      return prev; // Return the same object if no change to prevent re-renders
    });
  }, []);

  useEffect(() => {
    if (!pathname) return;
    
    const pageType = getPageType(pathname);
    const currentLastUrl = lastVisitedUrls[pageType];
    
    if (currentLastUrl !== pathname) {
      addToHistory(pageType, pathname);
    }
  }, [pathname, getPageType, addToHistory]);

  const contextValue = useMemo(() => ({
    config, 
    updateConfig, 
    resetConfig, 
    lastVisitedUrls,
    addToHistory,
  }), [config, updateConfig, resetConfig, lastVisitedUrls, addToHistory]);

  return (
    <HeaderContext.Provider value={contextValue}>
      {children}
    </HeaderContext.Provider>
  );
};

export default HeaderProvider;
