"use client";

import { createContext, useContext, ReactNode } from "react";
import { CommunityPortalConfig } from "@/lib/communities/config";

interface CommunityConfigContextValue {
  config: CommunityPortalConfig | null;
  isFromDatabase: boolean;
}

const CommunityConfigContext = createContext<CommunityConfigContextValue | null>(null);

export function useCommunityConfigContext(): CommunityConfigContextValue {
  const context = useContext(CommunityConfigContext);
  if (!context) {
    throw new Error("useCommunityConfigContext must be used within a CommunityConfigProvider");
  }
  return context;
}

export function useCommunityConfig(): CommunityPortalConfig | null {
  const { config } = useCommunityConfigContext();
  return config;
}

export function useIsConfigFromDatabase(): boolean {
  const { isFromDatabase } = useCommunityConfigContext();
  return isFromDatabase;
}

interface CommunityConfigProviderProps {
  children: ReactNode;
  config: CommunityPortalConfig | null;
  isFromDatabase: boolean;
}

export function CommunityConfigProvider({ children, config, isFromDatabase }: CommunityConfigProviderProps) {
  return (
    <CommunityConfigContext.Provider value={{ config, isFromDatabase }}>
      {children}
    </CommunityConfigContext.Provider>
  );
}
