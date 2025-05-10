"use client";

import React, { ReactNode, useState, useEffect } from "react";
import { HeaderConfig, HeaderContext } from "@/contexts/HeaderContext";
import { usePathname } from "next/navigation";

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
      
      if (lastVisitedUrls[pageType] !== pathname) {
        addToHistory(pageType, pathname);
      }
    }
  }, [pathname, lastVisitedUrls]);

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
