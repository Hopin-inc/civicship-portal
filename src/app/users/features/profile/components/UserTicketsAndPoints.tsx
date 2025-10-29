"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChevronRight, Ticket as TicketIcon, Wallet } from "lucide-react";
import { currentCommunityConfig } from "@/lib/communities/metadata";

interface UserTicketsAndPointsProps {
  ticketCount: number;
  pointCount: number;
}

export function UserTicketsAndPoints({ ticketCount, pointCount }: UserTicketsAndPointsProps) {
  const t = useTranslations();
  
  const ticketClass =
    ticketCount > 0
      ? "flex items-center gap-2 bg-primary-foreground text-primary rounded-lg px-4 py-3 mt-2 cursor-pointer hover:bg-primary-foreground/80"
      : "flex items-center gap-2 bg-muted text-caption rounded-lg px-4 py-3 mt-2";

  const pointClass =
    pointCount > 0
      ? "flex items-center gap-2 bg-primary-foreground text-primary rounded-lg px-4 py-3 mt-2 cursor-pointer hover:bg-primary-foreground/80"
      : "flex items-center gap-2 bg-muted text-caption rounded-lg px-4 py-3 mt-2";

  return (
    <div className="space-y-2 mt-2">
      {currentCommunityConfig.enableFeatures.includes("tickets") && (
        <Link href="/tickets">
          <div className={ticketClass}>
            <TicketIcon className="w-5 h-5 mb-0.5" />
            <p className="text-label-md">{t("users.ticketsAndPoints.ticketsLabel")}</p>
            <p className="text-label-md font-bold">{ticketCount}{t("users.ticketsAndPoints.ticketsUnit")}</p>
            <ChevronRight className="w-4 h-4 ml-auto" />
          </div>
        </Link>
      )}
      {currentCommunityConfig.enableFeatures.includes("points") && (
        <Link href="/wallets/me">
          <div className={pointClass}>
            <Wallet className="w-5 h-5 mb-0.5" />
            <p className="text-label-md">{t("users.ticketsAndPoints.pointsLabel")}</p>
            <p className="text-label-md font-bold">{pointCount.toLocaleString()}{t("users.ticketsAndPoints.pointsUnit")}</p>
            <ChevronRight className="w-4 h-4 ml-auto" />
          </div>
        </Link>
      )}
    </div>
  );
}
