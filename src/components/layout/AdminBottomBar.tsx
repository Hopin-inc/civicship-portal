"use client";

import { AppLink } from "@/lib/navigation";
import { Book, ClipboardList, Settings, Ticket } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import { matchPaths } from "@/utils/path";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { useTranslations } from "next-intl";

interface AdminBottomBarProps {
  className?: string;
}

const AdminBottomBar: React.FC<AdminBottomBarProps> = ({ className }) => {
  const t = useTranslations();
  const pathname = usePathname();
  const communityConfig = useCommunityConfig();
  const enabledFeatures = communityConfig?.enableFeatures ?? [];

  if (
    !pathname.startsWith("/admin") ||
    pathname.startsWith("/admin/reservations/") ||
    pathname.startsWith("/admin/credentials/") ||
    pathname.startsWith("/admin/tickets/") ||
    pathname.startsWith("/admin/opportunities/") ||
    pathname.startsWith("/admin/members") ||
    pathname.startsWith("/admin/wallet/")
  ) {
    return null;
  }

  const getLinkStyle = (...paths: string[]) => {
    const isActive = matchPaths(pathname, ...paths);
    return `flex flex-col items-center ${isActive ? "text-primary" : "text-muted-foreground"} hover:text-primary`;
  };

  return (
    <nav className={cn(className, "w-full bg-background border-t border-input py-4 z-50")}>
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center">
          {enabledFeatures.includes("opportunities") && (
            <AppLink
              href="/admin/reservations"
              className={cn(
                getLinkStyle("/admin/reservations", "/admin/reservations/*"),
                "flex-grow",
              )}
            >
              <Book size={24} />
              <span className="text-xs mt-1">{t("navigation.adminBottomBar.reservations")}</span>
            </AppLink>
          )}
          {enabledFeatures.includes("tickets") && (
            <AppLink
              href="/admin/tickets"
              className={cn(getLinkStyle("/admin/tickets", "/admin/tickets/*"), "flex-grow")}
            >
              <Ticket size={24} />
              <span className="text-xs mt-1">{t("navigation.adminBottomBar.tickets")}</span>
            </AppLink>
          )}
          {enabledFeatures.includes("credentials") && (
            <AppLink
              href="/admin/credentials"
              className={cn(
                getLinkStyle("/admin/credentials", "/admin/credentials/*"),
                "flex-grow",
              )}
            >
              <ClipboardList size={24} />
              <span className="text-xs mt-1">{t("navigation.adminBottomBar.credentials")}</span>
            </AppLink>
          )}
          <AppLink
            href="/admin"
            className={cn(getLinkStyle("/admin", "/admin/*"), "flex-grow")}
          >
            <Settings size={24} />
            <span className="text-xs mt-1">{t("navigation.adminBottomBar.settings")}</span>
          </AppLink>
        </div>
      </div>
    </nav>
  );
};

export default AdminBottomBar;
