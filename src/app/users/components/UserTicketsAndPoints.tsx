"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Ticket as TicketIcon, Wallet } from "lucide-react";
import { currentCommunityConfig } from "@/lib/communities/metadata";

interface UserTicketsAndPointsProps {
  ticketCount: number;
  pointCount: number;
}

const UserTicketsAndPoints: React.FC<UserTicketsAndPointsProps> = ({ ticketCount, pointCount }) => {
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
            <p className="text-label-md">利用できるチケット</p>
            <p className="text-label-md font-bold">{ticketCount}枚</p>
            <ChevronRight className="w-4 h-4 ml-auto" />
          </div>
        </Link>
      )}
      {currentCommunityConfig.enableFeatures.includes("points") && (
        <Link href="/wallets">
          <div className={pointClass}>
            <Wallet className="w-5 h-5 mb-0.5" />
            <p className="text-label-md">保有ポイント</p>
            <p className="text-label-md font-bold">{pointCount.toLocaleString()}pt</p>
            <ChevronRight className="w-4 h-4 ml-auto" />
          </div>
        </Link>
      )}
    </div>
  );
};

export default UserTicketsAndPoints;
