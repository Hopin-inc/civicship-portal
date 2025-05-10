"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useHeader } from "@/contexts/HeaderContext";

const PAGE_TYPES = {
  ACTIVITIES: "activities",
  SEARCH: "search",
  HOME: "home",
};

const NavigationTracker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const { addToHistory } = useHeader();

  const getPageType = (path: string): string => {
    if (path.startsWith('/activities')) {
      return PAGE_TYPES.ACTIVITIES;
    } else if (path.startsWith('/search')) {
      return PAGE_TYPES.SEARCH;
    }
    return PAGE_TYPES.HOME;
  };

  useEffect(() => {
    if (pathname) {
      const pageType = getPageType(pathname);
      addToHistory(pageType, pathname);
    }
  }, [pathname, addToHistory]);

  return children;
};

export default NavigationTracker;
