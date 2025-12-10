"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChevronRight, Wallet } from "lucide-react";
import { currentCommunityConfig } from "@/lib/communities/metadata";

interface UserTicketsAndPointsProps {
  pointCount?: number;
  canNavigate?: boolean;
}

interface MaybeLinkProps {
  canNavigate: boolean;
  href: string;
  children: React.ReactNode;
}

function MaybeLink({ canNavigate, href, children }: MaybeLinkProps) {
  if (canNavigate) {
    return <Link href={href}>{children}</Link>;
  }
  return <>{children}</>;
}

export function UserTicketsAndPoints({ pointCount, canNavigate = true }: UserTicketsAndPointsProps) {
  const t = useTranslations();

  const pointClass =
    pointCount && pointCount > 0
      ? `flex items-center gap-2 bg-primary-foreground text-primary rounded-lg px-4 py-3 mt-2 ${canNavigate ? "cursor-pointer hover:bg-primary-foreground/80" : ""}`
      : "flex items-center gap-2 bg-muted text-caption rounded-lg px-4 py-3 mt-2";

  const pointContent = (
    <div className={pointClass}>
      <Wallet className="w-5 h-5 mb-0.5" />
      <p className="text-label-md">{t("users.ticketsAndPoints.pointsLabel")}</p>
      <p className="text-label-md font-bold">{(pointCount ?? 0).toLocaleString()}{t("users.ticketsAndPoints.pointsUnit")}</p>
      {canNavigate && <ChevronRight className="w-4 h-4 ml-auto" />}
    </div>
  );

  return (
    <div className="space-y-2 mt-2">
      {currentCommunityConfig.enableFeatures.includes("points") && pointCount !== undefined && (
        <MaybeLink canNavigate={canNavigate} href="/wallets/me">
          {pointContent}
        </MaybeLink>
      )}
    </div>
  );
}
