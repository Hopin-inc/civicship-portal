import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CookiesProvider } from "next-client-cookies/server";
import ApolloProvider from "@/components/providers/ApolloProvider";
import { Toaster } from "@/components/ui/toast";
import LoadingProvider from "@/components/providers/LoadingProvider";
import { AuthProvider } from "@/contexts/AuthProvider";
import HeaderProvider from "@/components/providers/HeaderProvider";
import MainContent from "@/components/layout/MainContent";
import React from "react";
import AnalyticsProvider from "@/components/providers/AnalyticsProvider";
import ClientPolyfills from "@/components/polyfills/ClientPolyfills";
import { getUserServer } from "@/lib/auth/init/getUserServer";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { LiffDeepLinkHandler } from "@/components/liff/LiffDeepLinkHandler";
import { SwipeBackNavigation } from "@/components/navigation/SwipeBackNavigation";
import { BackgroundLayer } from "@/components/layout/BackgroundLayer";
import { CommunityConfigProvider } from "@/contexts/CommunityConfigContext";
import { CommunityPortalConfig, getCommunityConfig } from "@/lib/communities/config";
import { DEFAULT_ASSET_PATHS } from "@/lib/communities/constants";
import { headers } from "next/headers";

const font = Inter({ subsets: ["latin"] });

const getCommunityId = async () => {
  const headersList = await headers();
  return headersList.get("x-community-id") || "neo88";
};

export async function generateMetadata(): Promise<Metadata> {
  const communityId = await getCommunityId();
  const config = await getCommunityConfig(communityId);
  console.log(`Community Config: ${JSON.stringify(config, null, 2)}`);
  const isProduction = process.env.NODE_ENV === "production";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const communityId = await getCommunityId();
  const { user, lineAuthenticated, phoneAuthenticated } = await getUserServer();

  const locale = await getLocale();
  const messages = await getMessages();

  // Fetch community config from database
  let communityConfig: CommunityPortalConfig | null = null;
  let isFromDatabase = false;

  try {
    communityConfig = await getCommunityConfig(communityId);
    if (communityConfig) {
      isFromDatabase = true;
    }
  } catch (error) {
    console.error(
      `[CommunityConfig] Failed to fetch config for ${communityId} from database:`,
      error,
    );
  }

  return (
    <html lang={locale}>
      <body className={`${font.className}`}>
        <ClientPolyfills />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CookiesProvider>
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
          </CookiesProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
