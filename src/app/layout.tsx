import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CookiesProvider } from "next-client-cookies/server";
import ApolloProvider from "@/components/providers/ApolloProvider";
import { Toaster } from "@/components/ui/sonner";
import LoadingProvider from "@/components/providers/LoadingProvider";
import { LiffProvider } from "@/contexts/LiffContext";
import { AuthProvider } from "@/contexts/AuthContext";
import HeaderProvider from "@/components/providers/HeaderProvider";
import MainContent from "@/components/layout/MainContent";
import React from "react";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_ICONS,
  DEFAULT_OPEN_GRAPH,
  DEFAULT_TITLE,
} from "@/lib/metadata/defalut";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  icons: DEFAULT_ICONS,
  openGraph: DEFAULT_OPEN_GRAPH,
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className={font.className}>
        <CookiesProvider>
          <ApolloProvider>
            <LiffProvider>
              <AuthProvider>
                <HeaderProvider>
                  <LoadingProvider>
                    <MainContent>{children}</MainContent>
                    <Toaster richColors className="mx-8" />
                  </LoadingProvider>
                </HeaderProvider>
              </AuthProvider>
            </LiffProvider>
          </ApolloProvider>
        </CookiesProvider>
      </body>
    </html>
  );
};

export default RootLayout;
