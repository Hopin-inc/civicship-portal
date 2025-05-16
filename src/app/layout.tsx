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
// import AnalyticsProvider from "@/components/providers/AnalyticsProvider";
import React from "react";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NEO四国88祭",
  description:
    "四国にふれる。わたし、ふるえる。雄大な景色、独自の文化、そして暖かな人々との出会い。心が躍るさまざまな体験を通じて、新しい自分に出会う旅へ。地域の方々が用意する特別な体験がたくさん待っています。あなたのお気に入りを選んで、一期一会のオリジナルな旅を楽しんでみませんか？",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/images/favicon-16.png", type: "image/png", sizes: "16x16" },
      { url: "/images/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/images/favicon-48.png", type: "image/png", sizes: "48x48" },
    ],
  },
  openGraph: {
    title: "NEO四国88祭",
    description:
      "四国にふれる。わたし、ふるえる。雄大な景色、独自の文化、そして暖かな人々との出会い。心が躍るさまざまな体験を通じて、新しい自分に出会う旅へ。",
    url: "https://www.neo88.app",
    siteName: "NEO四国88祭",
    images: [
      {
        url: "https://storage.googleapis.com/prod-civicship-storage-public/asset/neo88/ogp.jpg",
        width: 1200,
        height: 630,
        alt: "NEO四国88祭",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
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
            <LiffProvider>
              <AuthProvider>
                <HeaderProvider>
                  <LoadingProvider>
                    {/*<AnalyticsProvider>*/}
                    <MainContent>{children}</MainContent>
                    <Toaster richColors className="mx-8" />
                    {/*</AnalyticsProvider>*/}
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
