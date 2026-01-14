"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDate } from "@/utils/date";
import { GqlClaimLinkStatus } from "@/types/graphql";

type TicketIssueCardProps = {
  status?: GqlClaimLinkStatus;
  qty?: number;
  createdAt?: string;
  href?: string;
  title?: string;
};

export function TicketIssueCard({
                                  status,
                                  qty,
                                  createdAt,
                                  href,
                                  title,
                                }: TicketIssueCardProps) {
  const statusVariant = status === GqlClaimLinkStatus.Issued ? "primary"
    : status === GqlClaimLinkStatus.Claimed ? "secondary"
      : "destructive";
  const statusLabel = status === GqlClaimLinkStatus.Issued ? "受取可能"
    : status === GqlClaimLinkStatus.Claimed ? "受取済み"
      : "無効";

  const content = (
    <Card
      className={ `transition-colors p-4 ${ href ? "cursor-pointer hover:bg-muted" : "opacity-50 pointer-events-none" }` }
    >
      <div className="flex flex-row items-center">
        <div className="flex flex-row items-center gap-2 flex-grow">
          <Badge variant={ statusVariant }>
            { statusLabel }
          </Badge>
          <p className="text-label-sm">
            発行数: { typeof qty === "number" ? qty : "不明" }
          </p>
        </div>
        <p className="text-body-sm text-muted-foreground">
          { createdAt ? formatDate(createdAt) : "作成日時不明" }
        </p>
      </div>
      <p className="text-body-md font-medium mt-2">{ title ?? "チケット" }</p>
    </Card>
  );

  return href ? <Link href={ href }>{ content }</Link> : content;
}
