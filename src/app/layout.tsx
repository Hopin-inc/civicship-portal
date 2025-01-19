import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CookiesProvider } from "next-client-cookies/server";
import ApolloProvider from "@/app/components/providers/ApolloProvider";
import { Toaster } from "@/app/components/ui/sonner";
import LoadingProvider from "@/app/components/providers/LoadingProvider";
import Header from "@/app/components/layout/Header";
import { AuthProvider } from "@/contexts/AuthContext";

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
            <AuthProvider>
              <LoadingProvider>
                <Header />
                <main className="flex-grow pt-16">{children}</main>
                <Toaster richColors className="mx-8" />
              </LoadingProvider>
            </AuthProvider>
          </ApolloProvider>
        </CookiesProvider>
      </body>
    </html>
  );
};

export default RootLayout;
