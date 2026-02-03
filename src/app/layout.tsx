import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CookiesProvider } from "next-client-cookies/server";
import React from "react";
import ClientPolyfills from "@/components/polyfills/ClientPolyfills";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { isProduction } from "@/lib/environment";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "civicship",
  description: "Community platform",
  robots: isProduction ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

/**
 * ルートレイアウト
 *
 * このレイアウトは全ページ（terms, privacy, community配下）に適用される。
 * CommunityConfigProvider等のテナント固有プロバイダーは
 * community/[communityId]/layout.tsx で提供される。
 */
const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${font.className}`}>
        <ClientPolyfills />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CookiesProvider>
            {children}
          </CookiesProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
