"use client";

import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHeader } from "@/components/providers/HeaderProvider";
import { useHierarchicalNavigation } from "@/hooks/useHierarchicalNavigation";
import { useAuthEnvironment } from "@/hooks/useAuthEnvironment";
import { cn } from "@/lib/utils";
import SearchBox from "@/app/search/components/SearchBox";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { config } = useHeader();
  const { navigateBack } = useHierarchicalNavigation();
  const { isInLine } = useAuthEnvironment();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  // Use runtime community config from context
  const communityConfig = useCommunityConfig();

  const handleBackButton = () => {
    if (config?.backTo) {
      router.push(config.backTo);
    } else if (pathname === "/search/result") {
      // When on search results page, preserve all search parameters when going back to search page
      const params = new URLSearchParams(searchParams);
      router.push(`/search?${params.toString()}`);
    } else {
      navigateBack();
    }
  };

  if (config.hideHeader) {
    return null;
  }

  // LIFF/LINEブラウザ環境では戻るボタンを非表示にする
  const shouldShowBackButton =
    config.showBackButton &&
    pathname !== "/" &&
    !isInLine;

  // レイアウト意図ベースの判定（LIFF環境でも戻るボタンの意図がある場合は左スロットとして扱う）
  const hasLeftSlotForLayout = config.showLogo || (config.showBackButton && pathname !== "/");
  const hasRightSlot = config.action != null;

  // タイトル中央寄せの判定
  // - 左スロット（ロゴまたは戻るボタンの意図）がある場合は中央寄せ
  // - 右側actionがない場合も中央寄せ
  const shouldCenterTitle = hasLeftSlotForLayout || !hasRightSlot;

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
            src={communityConfig?.squareLogoPath || "/logo.png"}
            alt="Logo"
            width={88}
            height={72}
            className="h-[28px] w-auto"
          />
        </Link>
      )}
      {communityConfig?.enableFeatures?.includes("opportunities") && config.showSearchForm && (
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
          />
        </div>
      )}
      {config.title && !config.showSearchForm && (
        <div
          className={cn(
            shouldCenterTitle
              ? "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              : "",
          )}
        >
          <h1
            className={cn(
              "text-title-sm truncate max-w-[80vw]",
              shouldCenterTitle ? "text-center" : "text-left",
            )}
          >
            {config.title}
          </h1>
        </div>
      )}
      {config.action && (
        <div className="ml-auto">
          {config.action}
        </div>
      )}
    </header>
  );
};

export default Header;
