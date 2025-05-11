
"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useCallback } from "react";
import { useHeader } from "@/components/providers/HeaderProvider";

const PAGE_TYPES = {
  ACTIVITIES: "activities",
  SEARCH: "search",
  PLACES: "places",
  USER: "user",
  HOME: "home",
};

const NavigationTracker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { addToHistory } = useHeader();

  const getPageType = useCallback((path: string): string => {
    if (path.startsWith('/activities')) {
      return PAGE_TYPES.ACTIVITIES;
    } else if (path.startsWith('/search')) {
      return PAGE_TYPES.SEARCH;
    } else if (path.startsWith('/places')) {
      return PAGE_TYPES.PLACES;
    } else if (path.startsWith('/users') || path.startsWith('/wallets') || path.startsWith('/tickets')) {
      return PAGE_TYPES.USER;
    }
    return PAGE_TYPES.HOME;
  }, []);

  useEffect(() => {
    if (!pathname) return;
    
    const pageType = getPageType(pathname);
    const fullPath = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    addToHistory(pageType, fullPath);
  }, [pathname, searchParams, addToHistory, getPageType]);

  return children;
};

export default NavigationTracker;
