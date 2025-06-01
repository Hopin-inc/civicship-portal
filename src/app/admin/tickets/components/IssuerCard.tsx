"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDate } from "@/utils/date";

type TicketIssueCardProps = {
  qtyToBeIssued?: number;
  claimQty?: number;
  createdAt?: string;
  href?: string;
  statusLabel?: string;
  statusVariant?: "primary" | "success" | "destructive";
};

export function TicketIssueCard({
  qtyToBeIssued,
  claimQty,
  createdAt,
  href,
  statusLabel,
  statusVariant = "primary",
}: TicketIssueCardProps) {
  const isClaimAvailable =
    typeof qtyToBeIssued === "number" && typeof claimQty === "number" && claimQty < qtyToBeIssued;

  const content = (
    <Card
      className={`transition-colors ${href ? "cursor-pointer hover:bg-muted" : "opacity-50 pointer-events-none"}`}
    >
      <CardHeader className="flex flex-row items-center gap-2 p-4 text-sm font-medium">
        <Badge variant={statusVariant}>{statusLabel ?? (isClaimAvailable ? "有効" : "無効")}</Badge>
        <span>発行数: {typeof qtyToBeIssued === "number" ? qtyToBeIssued : "不明"}</span>
      </CardHeader>

      <CardContent className="text-xs text-muted-foreground px-4 pt-0 pb-4">
        {createdAt ? formatDate(createdAt) : "作成日時不明"}
      </CardContent>
    </Card>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
