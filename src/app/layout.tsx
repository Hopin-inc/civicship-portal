import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CookiesProvider } from "next-client-cookies/server";
import ApolloProvider from "@/components/providers/ApolloProvider";
import { Toaster } from "@/components/ui/sonner";
import LoadingProvider from "@/components/providers/LoadingProvider";
import HeaderProvider from "@/components/providers/HeaderProvider";
import MainContent from "@/components/layout/MainContent";
import React from "react";
import { currentCommunityMetadata } from "@/lib/communities/metadata";

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
      <body className={font.className}>
        <CookiesProvider>
          <ApolloProvider>
            <HeaderProvider>
              <LoadingProvider>
                {/*/!*<AnalyticsProvider />*!/ useAuthを利用してるのでAuthProviderの最小化が実現できたら復元*/}
                <MainContent>{children}</MainContent>
                <Toaster richColors className="mx-8" />
              </LoadingProvider>
            </HeaderProvider>
          </ApolloProvider>
        </CookiesProvider>
      </body>
    </html>
  );
};

export default RootLayout;
