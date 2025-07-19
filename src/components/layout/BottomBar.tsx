"use client";

import Link from "next/link";
import { Globe, Search, User } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import { matchPaths } from "@/utils/path";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { AuthEnvironment, detectEnvironment } from "@/lib/auth/environment-detector";
import { currentCommunityConfig } from "@/lib/communities/metadata";

interface HeaderProps {
  className?: string;
}

const BottomBar: React.FC<HeaderProps> = ({ className }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const placeId = searchParams.get("placeId");

  const env = detectEnvironment();
  const isLiff = env === AuthEnvironment.LIFF;

  const { isVisible } = useScrollDirection({ threshold: 20 });

  if (currentCommunityConfig.enableFeatures.length < 2) {
    return null;
  }

  if (
    pathname.startsWith("/admin") ||
    (pathname.startsWith("/reservation") && !pathname.includes("/complete")) ||
    pathname.startsWith("/activities/") ||
    pathname.startsWith("/participations/") ||
    pathname.startsWith("/sign-up") ||
    pathname === "/users/me/edit" ||
    (pathname.startsWith("/places") && placeId) ||
    pathname.startsWith("/search")
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
        "fixed bottom-0 left-0 w-full bg-background border-t border-input z-50 transition-transform duration-300",
        !isLiff ? "py-4" : "pt-4 pb-10",
        !isVisible && "transform translate-y-full",
      )}
    >
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center">
          {currentCommunityConfig.enableFeatures.includes("opportunities") && (
            <Link
              href="/"
              className={cn(getLinkStyle("/activities", "/activities/*", "/search/*"), "flex-grow")}
            >
              <Search size={24} />
              <span className="text-xs mt-1">見つける</span>
            </Link>
          )}
          {currentCommunityConfig.enableFeatures.includes("places") && (
            <Link href="/places" className={cn(getLinkStyle("/places", "/places/*"), "flex-grow")}>
              <Globe size={24} />
              <span className="text-xs mt-1">拠点</span>
            </Link>
          )}
          <Link
            href="/users/me"
            className={cn(getLinkStyle("/users/me", "/users/me/*"), "flex-grow")}
          >
            <User size={24} />
            <span className="text-xs mt-1">マイページ</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default BottomBar;
