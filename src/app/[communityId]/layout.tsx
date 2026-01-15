import React from "react";
import { CommunityConfigProvider } from "@/contexts/CommunityConfigContext";
import { getCommunityConfig } from "@/lib/communities/config";
import type { CommunityPortalConfig } from "@/lib/communities/config";
import MainContent from "@/components/layout/MainContent";

interface CommunityLayoutProps {
  children: React.ReactNode;
  params: Promise<{ communityId: string }>;
}

export default async function CommunityLayout({ children, params }: CommunityLayoutProps) {
  const { communityId } = await params;

  let communityConfig: CommunityPortalConfig | null = null;
  let isFromDatabase = false;

  try {
    communityConfig = await getCommunityConfig(communityId);
    if (communityConfig) {
      isFromDatabase = true;
    }
  } catch (error) {
    console.error(`[CommunityConfig] Failed to fetch config for ${communityId} from database:`, error);
  }

  return (
    <CommunityConfigProvider config={communityConfig} isFromDatabase={isFromDatabase}>
      <MainContent>{children}</MainContent>
    </CommunityConfigProvider>
  );
}
