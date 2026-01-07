"use client";

import React from "react";
import Image from "next/image";
import { RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

interface WalletCardProps {
  currentPoint: number;
  isLoading: boolean;
  onRefetch?: () => void | Promise<void>;
  showRefreshButton?: boolean;
}

const WalletCard: React.FC<WalletCardProps> = ({
  currentPoint,
  isLoading,
  onRefetch,
  showRefreshButton = true,
}) => {
  const t = useTranslations();
  // Use runtime community config from context
  const communityConfig = useCommunityConfig();
  
  return (
    <div className="bg-background rounded-[32px] px-12 py-8 shadow-[0_2px_20px_rgba(0,0,0,0.08)] mt-8 mb-8">
      <div className="flex flex-col items-center mb-12">
        <div className="text-sm text-muted-foreground mb-2">
          {communityConfig?.tokenName || ""} {t("wallets.card.balanceLabel")}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-baseline">
            <span className="text-[40px] font-bold leading-none tracking-tight">
              {isLoading ? "..." : currentPoint.toLocaleString()}
            </span>
            <span className="text-base ml-0.5">{t("wallets.card.pointUnit")}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Image
          src={communityConfig?.logoPath || "/logo.png"}
          alt="Logo"
          width={80}
          height={24}
          className="opacity-60"
        />
        {onRefetch && showRefreshButton && (
          <Button
            onClick={onRefetch}
            variant="tertiary"
            size="sm"
            className="flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{t("wallets.card.refreshButton")}</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default WalletCard;
