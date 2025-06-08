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
  statusVariant?: "primary" | "secondary";
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
      className={ `transition-colors ${ href ? "cursor-pointer hover:bg-muted" : "opacity-50 pointer-events-none" }` }
    >
      <CardContent className="flex flex-row items-center gap-2 p-4">
        <div className="flex flex-row items-center gap-2 flex-grow">
          <Badge variant={ statusVariant }>
            { statusLabel ?? (isClaimAvailable ? "未使用" : "使用済み") }
          </Badge>
          <p className="text-label-md">
            発行数: { typeof qtyToBeIssued === "number" ? qtyToBeIssued : "不明" }
          </p>
        </div>
        <p className="text-body-sm text-muted-foreground">
          { createdAt ? formatDate(createdAt) : "作成日時不明" }
        </p>
      </CardContent>
    </Card>
  );

  return href ? <Link href={ href }>{ content }</Link> : content;
}
