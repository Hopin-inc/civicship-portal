"use client";

import { createContext, useContext, ReactNode, useEffect } from "react";
import { CommunityPortalConfig } from "@/lib/communities/config";
import { useCommunityStore } from "@/lib/community/community-store";
import { logger } from "@/lib/logging";

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
  // Zustand store に communityId を同期
  useEffect(() => {
    const storeBefore = useCommunityStore.getState().state.communityId;

    if (config?.communityId) {
      logger.info("[CommunityConfigProvider] Syncing communityId to store", {
        communityId: config.communityId,
        isFromDatabase,
        storeStateBefore: storeBefore,
        firebaseTenantId: config.firebaseTenantId,
        component: "CommunityConfigProvider",
      });
      useCommunityStore.getState().setCommunityId(config.communityId, "ssr");
    } else {
      logger.warn("[CommunityConfigProvider] No communityId in config — store not synced", {
        hasConfig: !!config,
        isFromDatabase,
        storeStateBefore: storeBefore,
        component: "CommunityConfigProvider",
      });
    }
  }, [config, isFromDatabase]);

  return (
    <CommunityConfigContext.Provider value={{ config, isFromDatabase }}>
      {children}
    </CommunityConfigContext.Provider>
  );
}
