"use client";

import { ReactNode, useState, useEffect } from "react";
import { HeaderConfig, HeaderContext } from "@/contexts/HeaderContext";
import { usePathname } from "next/navigation";

const defaultConfig: HeaderConfig = {
  title: undefined,
  showBackButton: false,
  showLogo: true,
  showSearchForm: false,
  action: undefined,
  backTo: undefined,
};

const PAGE_TYPES = {
  ACTIVITIES: "activities",
  SEARCH: "search",
  HOME: "home",
};

const HeaderProvider = ({ children }: { children: ReactNode }) => {
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
  }, [pathname]);

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

export default HeaderProvider;
