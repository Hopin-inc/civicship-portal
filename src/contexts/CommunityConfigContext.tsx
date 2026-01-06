"use client";

import { createContext, useContext, ReactNode, useEffect } from "react";
import { CommunityPortalConfig } from "@/lib/communities/getCommunityConfig";
import { setCurrentCommunityFirebaseTenantId } from "@/lib/communities/communityIds";

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
  // Set the current community's Firebase tenant ID for Apollo client to access
  // This is needed because Apollo's requestLink can't use React hooks
  useEffect(() => {
    setCurrentCommunityFirebaseTenantId(config?.firebaseTenantId ?? null);
  }, [config?.firebaseTenantId]);

  return (
    <CommunityConfigContext.Provider value={{ config, isFromDatabase }}>
      {children}
    </CommunityConfigContext.Provider>
  );
}
