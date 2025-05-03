"use client";

import Link from "next/link";
import { Search, Globe, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import micromatch from "micromatch";
import React from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  className?: string
}

const BottomBar: React.FC<HeaderProps> = ({ className }) => {
  const pathname = usePathname();

  // Hide BottomBar on search and reservation pages except complete page
  if (
    pathname === "/search" ||
    (pathname.startsWith("/reservation") && !pathname.includes("/complete")) ||
    pathname.startsWith("/activities/") ||
    pathname.startsWith("/participations/") ||
    pathname === "/users/me/edit"
    // || pathname.startsWith('/places')
  ) {
    return null;
  }

  const getLinkStyle = (...paths: string[]) => {
    const pathOnly = pathname.split(/[?#]/, 1)[0];
    const isActive = paths.some((path) => micromatch.isMatch(pathOnly, path));
    return `flex flex-col items-center ${isActive ? "text-blue-500" : "text-gray-600"} hover:text-blue-500`;
  };

  return (
    <nav className={cn(className, "w-full bg-white border-t border-gray-200 py-2 z-50")}>
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center">
          <Link
            href="/activities"
            className={getLinkStyle("/activities", "/activities/*", "/search/*")}
          >
            <Search size={24} />
            <span className="text-xs mt-1">見つける</span>
          </Link>
          <Link href="/places" className={getLinkStyle("/places", "/places/*")}>
            <Globe size={24} />
            <span className="text-xs mt-1">探す</span>
          </Link>
          <Link href="/users/me" className={getLinkStyle("/users/me", "/users/me/*")}>
            <User size={24} />
            <span className="text-xs mt-1">マイページ</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default BottomBar;
