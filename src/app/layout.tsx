import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CookiesProvider } from "next-client-cookies/server";
import ApolloProvider from "@/components/providers/ApolloProvider";
import { Toaster } from "@/components/ui/toast";
import LoadingProvider from "@/components/providers/LoadingProvider";
import { AuthProvider } from "@/contexts/AuthProvider";
import HeaderProvider from "@/components/providers/HeaderProvider";
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
import { headers, cookies } from "next/headers";
import { getCommunityConfig } from "@/lib/communities/config";

const font = Inter({ subsets: ["latin"] });

// Root layout uses generic metadata - community-specific metadata is generated in [communityId]/layout.tsx
export const metadata: Metadata = {
  title: "civicship",
  description: "",
};

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
  // Extract communityId from x-community-id header (set by middleware)
  // This includes communityId extracted from liff.state for LINE OAuth callbacks
  const headersList = await headers();
  const cookieStore = await cookies();
  
  // Try header first, then fall back to cookie (middleware sets both)
  const communityIdFromHeader = headersList.get("x-community-id");
  const communityIdFromCookie = cookieStore.get("x-community-id")?.value;
  const communityId = communityIdFromHeader || communityIdFromCookie || undefined;
  
  console.log("[RootLayout] Reading x-community-id:", {
    fromHeader: communityIdFromHeader || "not found",
    fromCookie: communityIdFromCookie || "not found",
    resolved: communityId || "none",
  });
  
  // Fetch community config if communityId is available
  // This is important for LINE OAuth callbacks where the URL is /?liff.state=/neo88/users/me
  // The middleware extracts communityId from liff.state and sets it in the header
  let communityConfig = null;
  let isFromDatabase = false;
  if (communityId) {
    try {
      communityConfig = await getCommunityConfig(communityId);
      if (communityConfig) {
        isFromDatabase = true;
      }
    } catch (error) {
      console.error("[RootLayout] Failed to fetch community config:", error);
    }
  }
  
  const { user, lineAuthenticated, phoneAuthenticated } = await getUserServer(communityId);

  const locale = await getLocale();
  const messages = await getMessages();

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
                        {children}
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
