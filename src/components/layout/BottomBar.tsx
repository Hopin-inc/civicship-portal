"use client";

import CommunityLink from "@/components/navigation/CommunityLink";
import { Globe, Home, Search, User } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import { matchPaths } from "@/utils/path";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useAuthEnvironment } from "@/hooks/useAuthEnvironment";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { useTranslations } from "next-intl";

interface HeaderProps {
  className?: string;
}

const BottomBar: React.FC<HeaderProps> = ({ className }) => {
  const t = useTranslations();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const placeId = searchParams.get("placeId");
  const communityConfig = useCommunityConfig();

  const { isLiffClient } = useAuthEnvironment();

  const { isVisible } = useScrollDirection({ threshold: 20 });

  const hasOppOrQuest =
    communityConfig?.enableFeatures?.includes("opportunities") ||
    communityConfig?.enableFeatures?.includes("quests");

  if ((communityConfig?.enableFeatures?.length ?? 0) < 2) {
    return null;
  }

  if (
    matchPaths(pathname, "/admin", "/admin/*") ||
    (matchPaths(pathname, "/reservation", "/reservation/*") && !matchPaths(pathname, "/reservation/complete")) ||
    matchPaths(pathname, "/activities/*") ||
    matchPaths(pathname, "/quests/*") ||
    matchPaths(pathname, "/participations/*") ||
    matchPaths(pathname, "/sign-up", "/sign-up/*") ||
    matchPaths(pathname, "/users/me/edit") ||
    (matchPaths(pathname, "/places", "/places/*") && placeId) ||
    matchPaths(pathname, "/search", "/search/*") ||
    matchPaths(pathname, "/wallets", "/wallets/*") ||
    matchPaths(pathname, "/credentials", "/credentials/*") ||
    matchPaths(pathname, "/transactions", "/transactions/*")
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
            <CommunityLink
              href="/opportunities"
              className={cn(
                getLinkStyle("/opportunities", "/opportunities/*", "opportunities/search/*"),
                "flex-grow",
              )}
            >
              <Search size={24} />
              <span className="text-xs mt-1">{t("navigation.bottomBar.discover")}</span>
            </CommunityLink>
          ) : (
            <CommunityLink
              href="/transactions"
              className={cn(getLinkStyle("/transactions", "/transactions/*"), "flex-grow")}
            >
              <Home size={24} />
              <span className="text-xs mt-1">{t("navigation.bottomBar.timeline")}</span>
            </CommunityLink>
          )}
          {communityConfig?.enableFeatures?.includes("places") && (
            <CommunityLink href="/places" className={cn(getLinkStyle("/places", "/places/*"), "flex-grow")}>
              <Globe size={24} />
              <span className="text-xs mt-1">{t("navigation.bottomBar.places")}</span>
            </CommunityLink>
          )}
          <CommunityLink
            href="/users/me"
            className={cn(getLinkStyle("/users/me", "/users/me/*"), "flex-grow")}
          >
            <User size={24} />
            <span className="text-xs mt-1">{t("navigation.bottomBar.myPage")}</span>
          </CommunityLink>
        </div>
      </div>
    </nav>
  );
};

export default BottomBar;
