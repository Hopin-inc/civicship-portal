"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import LoginModal from "@/components/features/login/LoginModal";
import { useHeader } from "@/contexts/HeaderContext";
import { cn } from "@/lib/utils";
import SearchBox from "../features/search/SearchBox";

interface HeaderProps {
  className?: string
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { config } = useHeader();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const shouldShowBackButton = config.showBackButton && pathname !== '/';

  return (
    <header className={cn(className, "border-b border-border bg-background w-full z-50")}>
      <div className="max-w-lg mx-auto px-4 h-16 flex justify-between items-center">
        <div className="flex-1 flex items-center">
          {shouldShowBackButton && (
            <button
              onClick={() => router.back()}
              className="mr-4 hover:text-foreground/80 transition-colors"
              aria-label="戻る"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          {config.showLogo && (
            <Link href="/public" className="flex items-center space-x-2">
              <Image src="/images/neo88-logo.jpg" alt="NEO88" width={88} height={80} />
            </Link>
          )}
          {config.showSearchForm && (
            <div className="flex-1 ml-4">
              <SearchBox
                location={config.searchParams?.location}
                from={config.searchParams?.from}
                to={config.searchParams?.to}
                guests={config.searchParams?.guests}
              />
            </div>
          )}
          {config.title && !config.showSearchForm && (
            <h1
              className={cn(
                "text-lg font-bold text-secondary-foreground",
                config.showLogo
                  ? "ml-4"
                  : "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              )}
            >
              {config.title}
            </h1>
          )}
        </div>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </header>
  );
};

export default Header;
