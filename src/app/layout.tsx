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

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ja">
    <body className={ font.className }>
    <script
      dangerouslySetInnerHTML={ {
        __html: `
            if (typeof window !== 'undefined' && !window.requestIdleCallback) {
              let lastId = 0;
              const timeouts = new Map();
              window.requestIdleCallback = function(callback, options) {
                const id = ++lastId;
                const timeout = options?.timeout || 0;
                const timeoutId = setTimeout(() => {
                  const start = performance.now();
                  callback({
                    didTimeout: timeout > 0,
                    timeRemaining() {
                      return Math.max(0, 16 - (performance.now() - start));
                    }
                  });
                  timeouts.delete(id);
                }, 1);
                timeouts.set(id, timeoutId);
                return id;
              };
              window.cancelIdleCallback = function(id) {
                const timeoutId = timeouts.get(id);
                if (timeoutId) {
                  clearTimeout(timeoutId);
                  timeouts.delete(id);
                }
              };
            }
          `,
      } }
    />
    <CookiesProvider>
      <ApolloProvider>
        <AuthProvider>
          <HeaderProvider>
            <LoadingProvider>
              <AnalyticsProvider />
              <MainContent>{ children }</MainContent>
              <Toaster richColors className="mx-8" />
            </LoadingProvider>
          </HeaderProvider>
        </AuthProvider>
      </ApolloProvider>
    </CookiesProvider>
    </body>
    </html>
  );
};

export default RootLayout;
