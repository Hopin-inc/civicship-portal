"use client";

import Link from "next/link";
import { Globe, Home, Search, User } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import { matchPaths } from "@/utils/path";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useAuthEnvironment } from "@/hooks/useAuthEnvironment";
import { currentCommunityConfig } from "@/lib/communities/metadata";
import { useTranslations } from "next-intl";

interface HeaderProps {
  className?: string;
}

const BottomBar: React.FC<HeaderProps> = ({ className }) => {
  const t = useTranslations();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const placeId = searchParams.get("placeId");

  const { isLiffClient } = useAuthEnvironment();

  const { isVisible } = useScrollDirection({ threshold: 20 });

  const hasOppOrQuest =
    currentCommunityConfig.enableFeatures.includes("opportunities") ||
    currentCommunityConfig.enableFeatures.includes("quests");

  if (currentCommunityConfig.enableFeatures.length < 2) {
    return null;
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
    return null;
  }

  const getLinkStyle = (...paths: string[]) => {
    const isActive = matchPaths(pathname, ...paths);
    return `flex flex-col items-center ${isActive ? "text-primary" : "text-muted-foreground"} hover:text-primary`;
  };

  return (
    <nav
      className={cn(
        className,
        "fixed bottom-0 left-0 w-full bg-background border-t border-input z-40 transition-transform duration-300",
        !isLiffClient ? "py-4" : "pt-4 pb-10",
        !isVisible && "transform translate-y-full",
      )}
    >
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center">
          {hasOppOrQuest ? (
            <Link
              href="/opportunities"
              className={cn(
                getLinkStyle("/opportunities", "/opportunities/*", "opportunities/search/*"),
                "flex-grow",
              )}
            >
              <Search size={24} />
              <span className="text-xs mt-1">{t("navigation.bottomBar.discover")}</span>
            </Link>
          ) : (
            <Link
              href="/transactions"
              className={cn(getLinkStyle("/transactions", "/transactions/*"), "flex-grow")}
            >
              <Home size={24} />
              <span className="text-xs mt-1">{t("navigation.bottomBar.timeline")}</span>
            </Link>
          )}
          {currentCommunityConfig.enableFeatures.includes("places") && (
            <Link href="/places" className={cn(getLinkStyle("/places", "/places/*"), "flex-grow")}>
              <Globe size={24} />
              <span className="text-xs mt-1">{t("navigation.bottomBar.places")}</span>
            </Link>
          )}
          <Link
            href="/users/me"
            className={cn(getLinkStyle("/users/me", "/users/me/*"), "flex-grow")}
          >
            <User size={24} />
            <span className="text-xs mt-1">{t("navigation.bottomBar.myPage")}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default BottomBar;
