import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CookiesProvider } from "next-client-cookies/server";
import ApolloProvider from "@/app/components/providers/ApolloProvider";
import { Toaster } from "@/app/components/ui/sonner";
import LoadingProvider from "@/app/components/providers/LoadingProvider";
import Header from "@/app/components/layout/Header";
import { LiffProvider } from "@/contexts/LiffContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { HeaderProvider } from "@/contexts/HeaderContext";
import BottomBar from "./components/layout/BottomBar";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "civicship",
  description: "Generated by create next app",
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
                    <Header />
                    <main className="max-w-lg mx-auto pt-16">{children}</main>
                    <Toaster richColors className="mx-8" />
                    <BottomBar />
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