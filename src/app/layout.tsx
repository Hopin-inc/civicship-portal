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
import { headers } from "next/headers";

const font = Inter({ subsets: ["latin"] });

// Root layout uses generic metadata - community-specific metadata is generated in [communityId]/layout.tsx
export const metadata: Metadata = {
  title: "Civicship",
  description: "Community platform",
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
  const headersList = await headers();
  const communityId = headersList.get("x-community-id") || undefined;
  
  // Debug logging for auth header
  console.log("[RootLayout] Headers:", {
    communityId,
    allHeaders: Object.fromEntries(headersList.entries()),
  });
  
  const { user, lineAuthenticated, phoneAuthenticated } = await getUserServer(communityId);

  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${font.className}`}>
        <ClientPolyfills />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CookiesProvider>
            <CommunityConfigProvider config={null} isFromDatabase={false}>
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
