"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

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

type HeaderContextState = {
  config: HeaderConfig;
  updateConfig: (config: HeaderConfig) => void;
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

const PAGE_TYPES = {
  ACTIVITIES: "activities",
  SEARCH: "search",
  HOME: "home",
};

export const HeaderContext = createContext<HeaderContextState | undefined>(undefined);

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
};

export const HeaderProvider = ({ children }: { children: ReactNode }) => {
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
      }
      
      if (lastVisitedUrls[pageType] !== pathname) {
        addToHistory(pageType, pathname);
      }
    }
  }, [pathname, lastVisitedUrls]);

  const updateConfig = (newConfig: HeaderConfig) => {
    setConfig((prevConfig) => ({ ...prevConfig, ...newConfig }));
  };

  const resetConfig = () => {
    setConfig(defaultConfig);
  };

  const addToHistory = (pageType: string, url: string) => {
    setLastVisitedUrls((prev) => {
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
