"use client";

import Link from "next/link";
import { Book, Ticket } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import { matchPaths } from "@/utils/path";

interface AdminBottomBarProps {
  className?: string;
}

const AdminBottomBar: React.FC<AdminBottomBarProps> = ({ className }) => {
  const pathname = usePathname();

  if (
    !pathname.startsWith("/admin") ||
    pathname.startsWith("/admin/reservations/") ||
    pathname.startsWith("/admin/slots/")
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
          <Link
            href="/admin/reservations"
            className={cn(
              getLinkStyle("/admin/reservations", "/admin/reservations/*"),
              "flex-grow",
            )}
          >
            <Book size={24} />
            <span className="text-xs mt-1">予約管理</span>
          </Link>
          {/*<Link*/}
          {/*  href="/admin/settings"*/}
          {/*  className={cn(getLinkStyle("/admin/settings", "/admin/settings/*"), "flex-grow")}*/}
          {/*>*/}
          {/*  <Settings size={24} />*/}
          {/*  <span className="text-xs mt-1">設定</span>*/}
          {/*</Link>*/}
          <Link
            href="/admin/tickets"
            className={cn(getLinkStyle("/admin/tickets", "/admin/tickets/*"), "flex-grow")}
          >
            <Ticket size={24} />
            <span className="text-xs mt-1">チケット発行</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AdminBottomBar;
