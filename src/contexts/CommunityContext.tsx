"use client";

import { createContext, useContext, useState } from "react";

const CommunityContext = createContext<{
  communityId: string | null;
  setCommunityId: (id: string) => void;
}>({
  communityId: null,
  setCommunityId: () => {},
});

export const CommunityProvider = ({ children }: { children: React.ReactNode }) => {
  const [communityId, setCommunityId] = useState<string | null>(null);

  return (
    <CommunityContext.Provider value={{ communityId, setCommunityId }}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunityContext = () => useContext(CommunityContext);
