import type { Metadata } from "next";
import ApolloProvider from "@/components/providers/ApolloProvider";
import { Toaster } from "@/components/ui/toast";
import LoadingProvider from "@/components/providers/LoadingProvider";
import { AuthProvider } from "@/contexts/AuthProvider";
import HeaderProvider from "@/components/providers/HeaderProvider";
import MainContent from "@/components/layout/MainContent";
import React from "react";
import AnalyticsProvider from "@/components/providers/AnalyticsProvider";
import { getUserServer } from "@/lib/auth/init/getUserServer";
import { LiffDeepLinkHandler } from "@/components/liff/LiffDeepLinkHandler";
import { SwipeBackNavigation } from "@/components/navigation/SwipeBackNavigation";
import { BackgroundLayer } from "@/components/layout/BackgroundLayer";
import { CommunityConfigProvider } from "@/contexts/CommunityConfigContext";
import { CommunityPortalConfig, getCommunityConfig } from "@/lib/communities/config";
import { DEFAULT_ASSET_PATHS } from "@/lib/communities/constants";
import { isProduction } from "@/lib/environment";
import { logger } from "@/lib/logging";

interface CommunityLayoutProps {
  children: React.ReactNode;
  params: Promise<{ communityId: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ communityId: string }>;
}): Promise<Metadata> {
  const { communityId } = await params;
  const config = await getCommunityConfig(communityId);

  if (!config) {
    return {
      title: "civicship",
      description: "Community platform",
      robots: isProduction ? undefined : { index: false, follow: false },
    };
  }

  return {
    title: config.title,
    description: config.description,
    icons: {
      icon: [
        {
          url: config.faviconPrefix
            ? `${config.faviconPrefix}/favicon.ico`
            : DEFAULT_ASSET_PATHS.FAVICON,
        },
      ],
      apple: [
        {
          url: config.faviconPrefix
            ? `${config.faviconPrefix}/apple-touch-icon.png`
            : DEFAULT_ASSET_PATHS.APPLE_TOUCH_ICON,
        },
      ],
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url: config.domain,
      siteName: config.title,
      locale: "ja_JP",
      type: "website",
      images: [
        {
          url: config.ogImagePath,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
    },
    alternates: {
      canonical: config.domain,
    },
    robots: isProduction
      ? undefined
      : {
          index: false,
          follow: false,
        },
  };
}

const CommunityLayout = async ({ children, params }: CommunityLayoutProps) => {
  const { communityId } = await params;
  const { user, lineAuthenticated, phoneAuthenticated } = await getUserServer();

  // Fetch community config from database
  let communityConfig: CommunityPortalConfig | null = null;
  let isFromDatabase = false;

  try {
    communityConfig = await getCommunityConfig(communityId);
    if (communityConfig) {
      isFromDatabase = true;
    }
  } catch (error) {
    logger.error(
      `[CommunityConfig] Failed to fetch config for ${communityId} from database`,
      { error: error instanceof Error ? error.message : String(error) },
    );
  }

  return (
    <CommunityConfigProvider config={communityConfig} isFromDatabase={isFromDatabase}>
      <ApolloProvider>
        <AuthProvider
          ssrCurrentUser={user}
          ssrLineAuthenticated={lineAuthenticated}
          ssrPhoneAuthenticated={phoneAuthenticated}
        >
          <LiffDeepLinkHandler />
          <HeaderProvider>
            <SwipeBackNavigation>
              <LoadingProvider>
                <AnalyticsProvider />
                <BackgroundLayer />
                <MainContent>{children}</MainContent>
                <Toaster />
              </LoadingProvider>
            </SwipeBackNavigation>
          </HeaderProvider>
        </AuthProvider>
      </ApolloProvider>
    </CommunityConfigProvider>
  );
};

export default CommunityLayout;
