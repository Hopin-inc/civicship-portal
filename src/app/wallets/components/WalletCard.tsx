"use client";

import React from "react";
import Image from "next/image";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { currentCommunityConfig } from "@/lib/metadata/communityMetadata";

interface WalletCardProps {
  currentPoint: number;
  isLoading: boolean;
  onRefetch?: () => void | Promise<void>;
}

const WalletCard: React.FC<WalletCardProps> = ({ currentPoint, isLoading, onRefetch }) => {
  return (
    <div className="bg-background rounded-[32px] px-12 py-8 shadow-[0_2px_20px_rgba(0,0,0,0.08)] mt-8 mb-8">
      <div className="flex flex-col items-center mb-12">
        <div className="text-sm text-muted-foreground mb-2">NEO88 残高</div>
        <div className="flex items-center gap-3">
          <div className="flex items-baseline">
            <span className="text-[40px] font-bold leading-none tracking-tight">
              {isLoading ? "..." : currentPoint.toLocaleString()}
            </span>
            <span className="text-base ml-0.5">pt</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Image
          src={currentCommunityConfig.logoPath}
          alt="Logo"
          width={80}
          height={24}
          className="opacity-60"
        />
        {onRefetch && (
          <Button
            onClick={onRefetch}
            variant="tertiary"
            size="sm"
            className="flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">再読み込み</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default WalletCard;
