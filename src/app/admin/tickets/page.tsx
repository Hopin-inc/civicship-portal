"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Button } from "@/components/ui/button";
import { CardWrapper } from "@/components/ui/card-wrapper";
import {
  GqlSortDirection,
  useGetTicketIssuersQuery,
  useGetUtilitiesQuery,
} from "@/types/graphql";
import { COMMUNITY_ID } from "@/utils";
import { useAuth } from "@/contexts/AuthProvider";
import { TicketIssueCard } from "@/app/admin/tickets/components/IssuerCard";

export default function TicketsPage() {
  const headerConfig = useMemo(() => ({ title: "チケット管理", showLogo: false }), []);
  useHeaderConfig(headerConfig);
  const router = useRouter();

  const { user } = useAuth();

  const { data: utilityData } = useGetUtilitiesQuery({
    variables: {
      filter: { communityIds: [COMMUNITY_ID], ownerIds: [user?.id ?? ""] },
      sort: { createdAt: GqlSortDirection.Desc },
      first: 20,
    },
  });

  const { data: ticketData } = useGetTicketIssuersQuery({
    variables: {
      filter: { ownerId: user?.id ?? "" },
      sort: { createdAt: GqlSortDirection.Desc },
      first: 20,
    },
  });

  const utilityList = utilityData?.utilities?.edges?.map((e) => e?.node) ?? [];
  const ticketList = ticketData?.ticketIssuers?.edges?.map((e) => e?.node) ?? [];

  return (
    <div className="p-4 space-y-8 max-w-2xl mx-auto">
      {/* チケットリンク一覧セクション */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">チケットリンク一覧</h2>
          <Button onClick={() => router.push("/admin/tickets/new")}>
            新規発行
          </Button>
        </div>
        <div className="space-y-2">
          {ticketList.length === 0 ? (
            <p className="text-muted-foreground">発行リンクがありません</p>
          ) : (
            ticketList.map((ticket) => (
              <TicketIssueCard
                key={`${ticket?.id}-${ticket?.claimLink?.id ?? "no-claimLink"}`}
                qtyToBeIssued={ticket?.qtyToBeIssued}
                claimQty={ticket?.claimLink?.qty}
                createdAt={
                  ticket?.createdAt instanceof Date
                    ? ticket.createdAt.toISOString()
                    : (ticket?.createdAt ?? "")
                }
                href={`/admin/tickets/${ticket?.claimLink?.id}`}
                statusVariant={
                  ticket?.claimLink?.qty != null &&
                  ticket?.qtyToBeIssued != null &&
                  ticket?.claimLink.qty < ticket?.qtyToBeIssued
                    ? "success"
                    : "destructive"
                }
              />
            ))
          )}
        </div>
      </div>

      {/* チケットの種類一覧セクション */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">チケットの種類一覧</h2>
          <Button
            variant="text"
            onClick={() => router.push("/admin/tickets/utilities")}
          >
            チケットの種類を管理する
          </Button>
        </div>
        <div className="space-y-2">
          {utilityList.length === 0 ? (
            <p className="text-muted-foreground">チケットの種類がありません</p>
          ) : (
            utilityList.map((utility) => (
              <CardWrapper key={utility?.id} className="p-4">
                <div className="text-sm">
                  <div className="font-semibold">{utility?.name}</div>
                  <div className="text-muted-foreground">{utility?.description}</div>
                  <div>交換ポイント: {utility?.pointsRequired}</div>
                </div>
              </CardWrapper>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
