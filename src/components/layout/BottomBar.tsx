"use client";

import { Globe, Home, Search, User } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import { matchPaths } from "@/utils/path";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useAuthEnvironment } from "@/hooks/useAuthEnvironment";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { stripCommunityPrefix } from "@/lib/communities/communityIds";
import { CommunityLink } from "@/components/navigation/CommunityLink";
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
  const communityConfig = useCommunityConfig();

  const { isVisible } = useScrollDirection({ threshold: 20 });

  // Strip community prefix from pathname for path matching
  const basePath = stripCommunityPrefix(pathname);

  // Use runtime config from CommunityConfigContext
  const enableFeatures = communityConfig?.enableFeatures ?? [];
  const hasOppOrQuest =
    enableFeatures.includes("opportunities") ||
    enableFeatures.includes("quests");

  if (enableFeatures.length < 2) {
    return null;
  }

  if (
    basePath.startsWith("/admin") ||
    (basePath.startsWith("/reservation") && !basePath.includes("/complete")) ||
    basePath.startsWith("/activities/") ||
    basePath.startsWith("/quests/") ||
    basePath.startsWith("/participations/") ||
    basePath.startsWith("/sign-up") ||
    basePath === "/users/me/edit" ||
    (basePath.startsWith("/places") && placeId) ||
    basePath.startsWith("/search") ||
    basePath.startsWith("/wallets") ||
    basePath.startsWith("/credentials") ||
    basePath.startsWith("/transactions")
  ) {
    return null;
  }

  const getLinkStyle = (...paths: string[]) => {
    const isActive = matchPaths(basePath, ...paths);
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
          {enableFeatures.includes("places") && (
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
