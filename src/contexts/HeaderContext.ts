"use client";

import { createContext, useContext } from "react";

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

export const HeaderContext = createContext<HeaderContextState | undefined>(undefined);

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
};
