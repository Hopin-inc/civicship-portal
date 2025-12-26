"use client";

import { createContext, useContext, ReactNode } from "react";

interface CommunityContextValue {
  communityId: string;
}

const CommunityContext = createContext<CommunityContextValue | null>(null);

export function useCommunityContext(): CommunityContextValue {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error("useCommunityContext must be used within a CommunityProvider");
  }
  return context;
}

export function useCommunityId(): string {
  const { communityId } = useCommunityContext();
  return communityId;
}

interface CommunityProviderProps {
  children: ReactNode;
  communityId: string;
}

export function CommunityProvider({ children, communityId }: CommunityProviderProps) {
  return (
    <CommunityContext.Provider value={{ communityId }}>
      {children}
    </CommunityContext.Provider>
  );
}
