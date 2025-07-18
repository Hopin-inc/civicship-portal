"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { AuthEnvironment, detectEnvironment } from "@/lib/auth/environment-detector";
import { cn } from "@/lib/utils";
import { DisableReasonType } from "../types";
import { DISABLE_MESSAGES } from "../constants";


interface FooterProps {
  opportunityId: string;
  point: number | null;
  communityId: string | undefined;
  disableReason?: DisableReasonType;
}

export const Footer: React.FC<FooterProps> = ({
  opportunityId,
  point,
  communityId,
  disableReason,
}) => {
  const query = new URLSearchParams({
    id: opportunityId,
    community_id: communityId ?? COMMUNITY_ID,
  });

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
          <p className="text-body-sm">1人あたり</p>
            {
              point != null ? 
              <p>
                <span className="font-bold text-lg">{point.toLocaleString()}pt</span>
                <span className="text-sm font-normal">もらえる</span>
              </p> : "ポイント未定"
            }
        </div>
        {renderActionElement()}
      </div>
    </footer>
  );
};

