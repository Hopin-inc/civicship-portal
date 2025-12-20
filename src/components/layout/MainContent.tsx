"use client";

import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useHeader } from "@/components/providers/HeaderProvider";
import Header from "@/components/layout/Header";
import BottomBar from "@/components/layout/BottomBar";
import { RouteGuard } from "@/components/auth/RouteGuard";
import AdminBottomBar from "@/components/layout/AdminBottomBar";
import { currentCommunityConfig } from "@/lib/communities/metadata";

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  const { config } = useHeader();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const placeId = searchParams.get("placeId");

  const showHeader = !config?.hideHeader;

  // フッターを表示すべきかを判定
  const shouldShowFooter = () => {
    // hideFooter が明示的に設定されている場合はそれに従う
    if (config?.hideFooter !== undefined) {
      return !config.hideFooter;
    }

    // BottomBar の非表示条件をチェック
    if (currentCommunityConfig.enableFeatures.length < 2) {
      return false;
    }

    if (
      pathname.startsWith("/admin") ||
      (pathname.startsWith("/reservation") && !pathname.includes("/complete")) ||
      pathname.startsWith("/activities/") ||
      pathname.startsWith("/quests/") ||
      pathname.startsWith("/participations/") ||
      pathname.startsWith("/sign-up") ||
      pathname === "/users/me/edit" ||
      (pathname.startsWith("/places") && placeId) ||
      pathname.startsWith("/search") ||
      pathname.startsWith("/wallets") ||
      pathname.startsWith("/credentials") ||
      pathname.startsWith("/transactions")
    ) {
      return false;
    }

    return true;
  };

  const showFooter = shouldShowFooter();

  return (
    <div className="min-h-screen flex flex-col max-w-mobile-l mx-auto w-full">
      <Header />
      <main className={`w-full flex-grow ${showHeader ? "pt-16" : ""} ${showFooter ? "pb-16" : ""} overflow-y-auto`}>
        <RouteGuard>{children}</RouteGuard>
      </main>
      {showFooter && <BottomBar className="fixed bottom-0 left-0 right-0 z-50 max-w-mobile-l mx-auto w-full" />}
      {showFooter && <AdminBottomBar className="fixed bottom-0 left-0 right-0 z-50 max-w-mobile-l mx-auto w-full" />}
    </div>
  );
};

export default MainContent;
