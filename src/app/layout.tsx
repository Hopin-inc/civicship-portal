import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CookiesProvider } from "next-client-cookies/server";
import ApolloProvider from "@/components/providers/ApolloProvider";
import { Toaster } from "@/components/ui/sonner";
import LoadingProvider from "@/components/providers/LoadingProvider";
import { AuthProvider } from "@/contexts/AuthProvider";
import HeaderProvider from "@/components/providers/HeaderProvider";
import MainContent from "@/components/layout/MainContent";
import React from "react";
import { currentCommunityMetadata } from "@/lib/communities/metadata";
import AnalyticsProvider from "@/components/providers/AnalyticsProvider";
import ClientPolyfills from "@/components/polyfills/ClientPolyfills";
import { getUserServer } from "@/lib/auth/init/getUserServer";
import { NextIntlClientProvider } from 'next-intl';
import { getI18n } from '@/lib/i18n/getI18n';
import { performanceTracker } from "@/lib/logging/performance";
import { getCorrelationId } from "@/lib/logging/request-context";
import ClientPerformanceTracker from "@/components/performance/ClientPerformanceTracker";
import { initUndiciAgent } from "@/lib/server/runtime/init-undici";

const font = Inter({ subsets: ["latin"] });

if (typeof window === 'undefined') {
  initUndiciAgent();
}

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

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const correlationId = await getCorrelationId();

  return performanceTracker.measure(
    "RootLayout Render",
    async () => {
      const [
        { user, lineAuthenticated, phoneAuthenticated },
        { locale, messages }
      ] = await Promise.all([
        performanceTracker.measure(
          "RootLayout:getUserServer",
          () => getUserServer(),
          { correlationId, source: "RootLayout" }
        ),
        performanceTracker.measure(
          "RootLayout:getI18n",
          () => getI18n(),
          { correlationId }
        ),
      ]);

      return (
        <html lang={locale}>
          <body className={font.className}>
            <script
              dangerouslySetInnerHTML={{
                __html: 'window.__ssrHtmlFlushed = performance.now();',
              }}
            />
            <ClientPolyfills />
            <ClientPerformanceTracker correlationId={correlationId} />
            <NextIntlClientProvider 
              locale={locale} 
              messages={messages}
            >
              <CookiesProvider>
                <ApolloProvider>
                  <AuthProvider
                    ssrCurrentUser={user}
                    ssrLineAuthenticated={lineAuthenticated}
                    ssrPhoneAuthenticated={phoneAuthenticated}
                  >
                    <HeaderProvider>
                      <LoadingProvider>
                        <AnalyticsProvider />
                        <MainContent>{children}</MainContent>
                        <Toaster richColors className="mx-8" />
                      </LoadingProvider>
                    </HeaderProvider>
                  </AuthProvider>
                </ApolloProvider>
              </CookiesProvider>
            </NextIntlClientProvider>
          </body>
        </html>
      );
    },
    { correlationId, route: "RootLayout" }
  );
};

export default RootLayout;
