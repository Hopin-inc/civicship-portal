"use client";

import Link from "next/link";
import { FileText, Ticket } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import { matchPaths } from "@/utils/path";

interface AdminBottomBarProps {
  className?: string
}

const AdminBottomBar: React.FC<AdminBottomBarProps> = ({ className }) => {
  const pathname = usePathname();

  if (!pathname.startsWith("/admin")) {
    return null;
  }

  const getLinkStyle = (...paths: string[]) => {
    const isActive = matchPaths(pathname, ...paths)
    return `flex flex-col items-center ${isActive ? "text-primary" : "text-muted-foreground"} hover:text-primary`;
  };

  return (
    <nav className={cn(className, "w-full bg-background border-t border-input py-2 z-50")}>
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center">
          <Link
            href="/admin/reservations"
            className={getLinkStyle("/admin/reservations", "/admin/reservations/*")}
          >
            <FileText size={24} />
            <span className="text-xs mt-1">応募</span>
          </Link>
          <Link 
            href="/admin/tickets" 
            className={getLinkStyle("/admin/tickets", "/admin/tickets/*")}
          >
            <Ticket size={24} />
            <span className="text-xs mt-1">チケット</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default AdminBottomBar;
