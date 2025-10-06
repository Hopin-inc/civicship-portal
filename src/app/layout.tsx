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
import { getUserServer } from "@/lib/auth/getUserServer";

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

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { user, lineAuthenticated, phoneAuthenticated } = await getUserServer();
  console.log(user, lineAuthenticated, phoneAuthenticated);

  return (
    <html lang="ja">
      <body className={font.className}>
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
      </body>
    </html>
  );
};

export default RootLayout;
