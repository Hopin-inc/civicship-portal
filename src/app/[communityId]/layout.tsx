import React from "react";
import type { Metadata } from "next";
import { CommunityConfigProvider } from "@/contexts/CommunityConfigContext";
import { getCommunityConfig } from "@/lib/communities/config";
import type { CommunityPortalConfig } from "@/lib/communities/config";
import MainContent from "@/components/layout/MainContent";
import { DEFAULT_ASSET_PATHS } from "@/lib/communities/constants";

interface CommunityLayoutProps {
  children: React.ReactNode;
  params: Promise<{ communityId: string }>;
}

// Generate community-specific metadata from URL path parameter
export async function generateMetadata({ params }: CommunityLayoutProps): Promise<Metadata> {
  const { communityId } = await params;
  const config = await getCommunityConfig(communityId);
  const isProduction = process.env.NODE_ENV === "production";

  if (!config) {
    return {
      title: "Civicship",
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
