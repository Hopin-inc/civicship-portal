"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoginModal from "@/app/login/components/LoginModal";
import { useHeader } from "@/components/providers/HeaderProvider";
import { useHierarchicalNavigation } from "@/hooks/useHierarchicalNavigation";
import { cn } from "@/lib/utils";
import SearchBox from "@/app/search/components/SearchBox";
import { useRouter } from "next/navigation";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { config } = useHeader();
  const { navigateBack } = useHierarchicalNavigation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const pathname = usePathname();

  const router = useRouter();

  const handleBackButton = () => {
    if (config?.backTo) {
      router.push(config.backTo);
    } else {
      navigateBack();
    }
  };

  if (config.hideHeader) {
    return null;
  }

  const shouldShowBackButton = config.showBackButton && pathname !== "/";

  return (
    <header
      className={cn(
        className,
        "fixed top-0 left-0 right-0 z-50 bg-background border-b border-border max-w-mobile-l mx-auto w-full flex items-center px-4 transition-all duration-200",
        config.showSearchForm ? "h-20" : "h-16",
      )}
    >
      {shouldShowBackButton && (
        <Button onClick={handleBackButton} variant="icon-only" size="sm" aria-label="戻る">
          <ChevronLeft className="h-6 w-6" />
        </Button>
      )}
      {config.showLogo && (
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="/images/neo88-logo.jpg"
            alt="NEO88"
            width={88}
            height={72}
            className="h-[28px] w-auto"
          />
        </Link>
      )}
      {config.showSearchForm && (
        <div className="flex-1 ml-4">
          <SearchBox
            location={config.searchParams?.location}
            from={config.searchParams?.from}
            to={config.searchParams?.to}
            guests={config.searchParams?.guests?.toString()}
          />
        </div>
      )}
      {config.title && !config.showSearchForm && (
        <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col content-center justify-center -z-10">
          <h1 className="text-center text-title-md truncate">{config.title}</h1>
        </div>
      )}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </header>
  );
};

export default Header;
