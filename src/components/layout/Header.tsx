"use client";

import React, { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoginModal from "@/app/login/components/LoginModal";
import { useHeader } from "@/components/providers/HeaderProvider";
import { useHierarchicalNavigation } from "@/hooks/useHierarchicalNavigation";
import { cn } from "@/lib/utils";
import SearchBox from "@/app/search/components/SearchBox";
import { AuthEnvironment, detectEnvironment } from "@/lib/auth/environment-detector";
import { currentCommunityConfig } from "@/lib/communities/metadata";
interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { config } = useHeader();
  const { navigateBack } = useHierarchicalNavigation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const env = detectEnvironment();
  const router = useRouter();

  const handleBackButton = () => {
    if (config?.backTo) {
      router.push(config.backTo);
    } else if (pathname === "/search/result") {
      // When on search results page, preserve all search parameters when going back to search page
      const params = new URLSearchParams(searchParams);
      router.push(`${config.searchParams?.redirectTo ?? "/search"}?${params.toString()}`);
    } else {
      navigateBack();
    }
  };

  if (config.hideHeader) {
    return null;
  }

  const shouldShowBackButton =
    config.showBackButton &&
    pathname !== "/" &&
    !(env === AuthEnvironment.LIFF_IN_CLIENT || env === AuthEnvironment.LIFF_WITH_SDK);

  return (
    <header
      className={cn(
        className,
        "fixed top-0 left-0 right-0 z-50 bg-background border-b border-border max-w-mobile-l mx-auto w-full flex items-center px-6 transition-all duration-200",
        config.showSearchForm ? "h-20" : "h-16",
      )}
    >
      {shouldShowBackButton && (
        <Button onClick={handleBackButton} variant="icon-only" size="sm" aria-label="戻る">
          <ChevronLeft className="h-6 w-6 text-caption" />
        </Button>
      )}
      {config.showLogo && (
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src={currentCommunityConfig.squareLogoPath}
            alt="Logo"
            width={88}
            height={72}
            className="h-[28px] w-auto"
          />
        </Link>
      )}
      {currentCommunityConfig.enableFeatures.includes("opportunities") && config.showSearchForm && (
        <div className="flex-1 ml-4">
          <SearchBox
            location={config.searchParams?.location}
            from={config.searchParams?.from}
            to={config.searchParams?.to}
            guests={config.searchParams?.guests?.toString()}
            q={config.searchParams?.q}
            type={config.searchParams?.type}
            ticket={config.searchParams?.ticket}
            points={config.searchParams?.points}
            redirectTo={config.searchParams?.redirectTo}
          />
        </div>
      )}
      {config.title && !config.showSearchForm && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-title-md truncate max-w-[80vw] text-center">{config.title}</h1>
        </div>
      )}
    </header>
  );
};

export default Header;
