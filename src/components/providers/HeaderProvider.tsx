"use client";

import React, { ReactNode, useState, useEffect, createContext, useContext } from "react";
import { usePathname } from "next/navigation";

export interface HeaderConfig {
  title?: string;
  showBackButton?: boolean;
  showLogo?: boolean;
  showSearchForm?: boolean;
  action?: React.ReactNode;
  backTo?: string;
  searchParams?: {
    location?: string;
    from?: string;
    to?: string;
    guests?: number;
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

  useEffect(() => {
    if (pathname) {
      let pageType = PAGE_TYPES.HOME;
      
      if (pathname.startsWith("/activities")) {
        pageType = PAGE_TYPES.ACTIVITIES;
      } else if (pathname.startsWith("/search")) {
        pageType = PAGE_TYPES.SEARCH;
      } else if (pathname.startsWith("/places")) {
        pageType = PAGE_TYPES.PLACES;
      } else if (pathname.startsWith("/users") || pathname.startsWith("/wallets") || pathname.startsWith("/tickets")) {
        pageType = PAGE_TYPES.USER;
      }
      
      const lastUrl = lastVisitedUrls[pageType];
      if (lastUrl !== pathname) {
        addToHistory(pageType, pathname);
      }
    }
  }, [pathname]);

  const updateConfig = (newConfig: Partial<HeaderConfig>) => {
    setConfig((prevConfig: HeaderConfig) => ({ ...prevConfig, ...newConfig }));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
  };

  const addToHistory = (pageType: string, url: string) => {
    setLastVisitedUrls((prev: Record<string, string>) => {
      const newHistory = { ...prev };
      
      if (url !== prev[pageType]) {
        newHistory[pageType] = url;
      }
      
      return newHistory;
    });
  };

  return (
    <HeaderContext.Provider 
      value={{ 
        config, 
        updateConfig, 
        resetConfig, 
        lastVisitedUrls,
        addToHistory
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
};

export default HeaderProvider;
