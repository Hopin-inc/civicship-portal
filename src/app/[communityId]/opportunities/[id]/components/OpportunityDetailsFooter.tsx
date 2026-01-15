"use client";

import React from "react";
import CommunityLink from "@/components/navigation/CommunityLink";
import { Button } from "@/components/ui/button";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { useAuthEnvironment } from "@/hooks/useAuthEnvironment";
import { cn } from "@/lib/utils";

export type DisableReasonType = "noSlots" | "reservationClosed" | "externalBooking";

interface OpportunityDetailsFooterProps {
  opportunityId: string;
  price: number | null;
  point: number | null;
  pointsRequired?: number | null;
  communityId: string | undefined;
  disableReason?: DisableReasonType;
}

const DISABLE_MESSAGES = {
  noSlots: "開催日未定",
  reservationClosed: "受付終了",
  externalBooking: "直接お問い合わせ",
} as const;

export const OpportunityDetailsFooter: React.FC<OpportunityDetailsFooterProps> = ({
  opportunityId,
  price,
  point,
  pointsRequired,
  communityId,
  disableReason,
}) => {
  const { communityId: configCommunityId } = useCommunityConfig();
  const query = new URLSearchParams({
    id: opportunityId,
    community_id: communityId ?? configCommunityId,
  });

  const { isLiffClient } = useAuthEnvironment();

  const renderActionElement = () => {
    if (disableReason && disableReason in DISABLE_MESSAGES) {
      return (
        <p className="text-muted-foreground text-body-md">
          {DISABLE_MESSAGES[disableReason as keyof typeof DISABLE_MESSAGES]}
        </p>
      );
    }

    return (
      <CommunityLink href={`/reservation/select-date?${query.toString()}`}>
        <Button variant="primary" size="lg" className="px-8">
          日付を選択
        </Button>
      </CommunityLink>
    );
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background border-t z-50">
      <div
        className={cn(
          "max-w-mobile-l mx-auto px-4 flex items-center justify-between w-full",
          isLiffClient ? "h-28" : "h-20",
        )}
      >
        <div>
          <div>
            <p className="text-body-sm text-muted-foreground">1人あたり</p>
            {price === 0 && pointsRequired != null && pointsRequired > 0 ? (
              <p>
                <span className="font-bold text-body-lg">{pointsRequired.toLocaleString()}pt</span>
                <span className="text-sm font-normal">必要</span>
              </p>
            ) : price !== null ? (
              <p className="text-body-lg font-bold">{`${price.toLocaleString()}円〜`}</p>
            ) : point === null ? (
              <p className="text-body-lg font-bold text-muted-foreground/50">料金未定</p>
            ) : null}
            {point != null && (
              <p>
                <span className="font-bold text-body-lg">{point.toLocaleString()}pt</span>
                <span className="text-sm font-normal">もらえる</span>
              </p>
            )}
          </div>
        </div>
        {renderActionElement()}
      </div>
    </footer>
  );
};
