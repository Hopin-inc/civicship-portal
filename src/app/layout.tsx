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
import { currentCommunityMetadata, COMMUNITY_ID, COMMUNITY_BASE_CONFIG } from "@/lib/communities/metadata";
import AnalyticsProvider from "@/components/providers/AnalyticsProvider";
import ClientPolyfills from "@/components/polyfills/ClientPolyfills";
import { getUserServer } from "@/lib/auth/init/getUserServer";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { LiffDeepLinkHandler } from "@/components/liff/LiffDeepLinkHandler";
import { SwipeBackNavigation } from "@/components/navigation/SwipeBackNavigation";
import { CommunityProvider } from "@/contexts/CommunityContext";
import { CommunityConfigProvider } from "@/contexts/CommunityConfigContext";
import { headers, cookies } from "next/headers";
import { getCommunityConfig, CommunityPortalConfig } from "@/lib/communities/getCommunityConfig";

const font = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const metadata = currentCommunityMetadata;

  return {
    title: metadata.title,
    description: metadata.description,
    icons: metadata.icons,
    openGraph: metadata.openGraph,
    alternates: metadata.alternates,
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Helper function to convert hardcoded config to CommunityPortalConfig format
function convertToPortalConfig(communityId: string): CommunityPortalConfig | null {
  const baseConfig = COMMUNITY_BASE_CONFIG[communityId];
  if (!baseConfig) return null;
  
  return {
    communityId: baseConfig.id,
    tokenName: baseConfig.tokenName,
    title: baseConfig.title,
    description: baseConfig.description,
    shortDescription: baseConfig.shortDescription || null,
    domain: baseConfig.domain,
    faviconPrefix: baseConfig.faviconPrefix,
    logoPath: baseConfig.logoPath,
    squareLogoPath: baseConfig.squareLogoPath,
    ogImagePath: baseConfig.ogImagePath,
    enableFeatures: baseConfig.enableFeatures,
    rootPath: baseConfig.rootPath || "/",
    adminRootPath: baseConfig.adminRootPath || "/admin",
    documents: baseConfig.documents || null,
    commonDocumentOverrides: baseConfig.commonDocumentOverrides || null,
    regionName: null,
    regionKey: null,
    liffId: null,
    liffBaseUrl: null,
    firebaseTenantId: null,
  };
}

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user, lineAuthenticated, phoneAuthenticated } = await getUserServer();

  const locale = await getLocale();
  const messages = await getMessages();

  // Get communityId from request headers (set by middleware) or cookies or env var
  const headersList = await headers();
  const cookieStore = await cookies();
  const communityId = headersList.get("x-community-id") || cookieStore.get("communityId")?.value || COMMUNITY_ID;

  // Fetch community config from database, fallback to hardcoded config
  let communityConfig: CommunityPortalConfig | null = null;
  let isFromDatabase = false;
  
  try {
    communityConfig = await getCommunityConfig(communityId);
    if (communityConfig) {
      isFromDatabase = true;
      console.log(`[CommunityConfig] Loaded config for ${communityId} from database`);
    }
  } catch (error) {
    console.error(`[CommunityConfig] Failed to fetch config for ${communityId} from database:`, error);
  }
  
  // Fallback to hardcoded config if database fetch failed
  if (!communityConfig) {
    communityConfig = convertToPortalConfig(communityId);
    console.log(`[CommunityConfig] Using hardcoded config for ${communityId}`);
  }

  return (
    <html lang={locale}>
      <body className={font.className}>
        <ClientPolyfills />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CookiesProvider>
            <CommunityProvider communityId={communityId}>
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
                          <MainContent>{children}</MainContent>
                          <Toaster />
                        </LoadingProvider>
                      </SwipeBackNavigation>
                    </HeaderProvider>
                  </AuthProvider>
                </ApolloProvider>
              </CommunityConfigProvider>
            </CommunityProvider>
          </CookiesProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
