"use client";

import { createContext, useContext, useState } from "react";

const CommunityContext = createContext<{
  communityId: string | null;
  setCommunityId: (id: string) => void;
}>({
  communityId: null,
  setCommunityId: () => {},
});

export const CommunityProvider = ({
  children,
  initialCommunityId,
}: {
  children: React.ReactNode;
  initialCommunityId?: string;
}) => {
  const [communityId, setCommunityId] = useState<string | null>(initialCommunityId ?? null);

  return (
    <CommunityContext.Provider value={{ communityId, setCommunityId }}>
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunityContext = () => useContext(CommunityContext);
