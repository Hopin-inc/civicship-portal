"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { COMMUNITY_ID } from "@/utils";

interface ActivityDetailsFooterProps {
  opportunityId: string;
  price: number;
  communityId: string | undefined;
  disableReason?: "noSlots" | "reservationClosed";
}

const ActivityDetailsFooter: React.FC<ActivityDetailsFooterProps> = ({
  opportunityId,
  price,
  communityId,
  disableReason,
}) => {
  const query = new URLSearchParams({
    id: opportunityId,
    community_id: communityId ?? COMMUNITY_ID,
  });

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-background border-t z-50">
      <div className="max-w-mobile-l mx-auto px-4 h-20 flex items-center justify-between w-full">
        <div>
          <p className="text-body-sm text-muted-foreground">1人あたり</p>
          <p className="text-bodylg font-bold">{price.toLocaleString()}円〜</p>
        </div>
        {disableReason === "noSlots" ? (
          <p className="text-muted-foreground text-body-md">開催日未定</p>
        ) : disableReason === "reservationClosed" ? (
          <p className="text-muted-foreground text-body-md">受付終了</p>
        ) : (
          <Link href={`/reservation/select-date?${query.toString()}`}>
            <Button variant="primary" size="lg" className="px-8">
              日付を選択
            </Button>
          </Link>
        )}
      </div>
    </footer>
  );
};

export default ActivityDetailsFooter;
