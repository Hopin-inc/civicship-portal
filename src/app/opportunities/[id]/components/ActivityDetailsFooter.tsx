"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { COMMUNITY_ID } from "@/utils";
import { AuthEnvironment, detectEnvironment } from "@/lib/auth/environment-detector";
import { cn } from "@/lib/utils";

export type DisableReasonType = "noSlots" | "reservationClosed" | "externalBooking";

interface ActivityDetailsFooterProps {
  opportunity: { id: string; feeRequired?: number | null; pointsToEarn?: number | null };
  communityId: string | undefined;
  disableReason?: DisableReasonType;
}

const DISABLE_MESSAGES = {
  noSlots: "開催日未定",
  reservationClosed: "受付終了",
  externalBooking: "直接お問い合わせ",
} as const;

const ActivityDetailsFooter: React.FC<ActivityDetailsFooterProps> = ({
  opportunity,
  communityId,
  disableReason,
}) => {
  const query = new URLSearchParams({
    id: opportunity.id,
    community_id: communityId ?? COMMUNITY_ID,
  });
  
  const isQuest = 'pointsToEarn' in opportunity;
  const price = 'feeRequired' in opportunity ? opportunity.feeRequired : null;
  const points = 'pointsToEarn' in opportunity ? opportunity.pointsToEarn : null;

  const env = detectEnvironment();
  const isLiff = env === AuthEnvironment.LIFF;

  const renderActionElement = () => {
    if (disableReason && disableReason in DISABLE_MESSAGES) {
      return (
        <p className="text-muted-foreground text-body-md">
          {DISABLE_MESSAGES[disableReason as keyof typeof DISABLE_MESSAGES]}
        </p>
      );
    }

    return (
      <Link href={`/reservation/select-date?${query.toString()}`}>
        <Button variant="primary" size="lg" className="px-8">
          日付を選択
        </Button>
      </Link>
    );
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background border-t z-50">
      <div
        className={cn(
          "max-w-mobile-l mx-auto px-4 flex items-center justify-between w-full",
          isLiff ? "h-28" : "h-20",
        )}
      >
        <div>
          <p className="text-body-sm text-muted-foreground">{isQuest ? "獲得ポイント" : "1人あたり"}</p>
          <p className={cn("text-body-lg font-bold", (price == null && points == null) && "text-muted-foreground/50")}>
            {isQuest 
              ? points != null ? `${points}ポイント` : "ポイント未定"
              : price != null ? `${price.toLocaleString()}円〜` : "料金未定"}
          </p>
        </div>
        {renderActionElement()}
      </div>
    </footer>
  );
};

export default ActivityDetailsFooter;
