"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <header className={cn(className, "fixed top-0 left-0 right-0 z-50 bg-background border-b border-border max-w-mobile-l mx-auto w-full h-16 flex items-center px-4")}>
      {shouldShowBackButton && (
        <Button
          onClick={() => router.back()}
          variant="link"
          className="absolute left-4 p-0 h-auto"
          aria-label="戻る"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      )}
      {config.showLogo && (
        <Link href="/public" className="flex items-center space-x-2 absolute left-14">
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
        <h1 className="flex-1 text-center text-lg font-bold text-secondary-foreground truncate">
          {config.title}
        </h1>
      )}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </header>
  );
};

export default Header;
