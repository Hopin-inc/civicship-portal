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
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_ICONS,
  DEFAULT_OPEN_GRAPH,
  DEFAULT_TITLE,
} from "@/lib/metadata/defalut";
import AnalyticsProvider from "@/components/providers/AnalyticsProvider";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  icons: DEFAULT_ICONS,
  openGraph: DEFAULT_OPEN_GRAPH,
  alternates: {
    canonical: "https://www.neo88.app",
  },
};

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
