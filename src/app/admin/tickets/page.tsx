"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Button } from "@/components/ui/button";
import { CardWrapper } from "@/components/ui/card-wrapper";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import {
  GqlSortDirection,
  useGetTicketIssuersQuery,
  useGetUtilitiesQuery,
} from "@/types/graphql";
import { COMMUNITY_ID } from "@/utils";
import { useAuth } from "@/contexts/AuthProvider";
import { TicketIssueCard } from "@/app/admin/tickets/components/IssuerCard";
import CreateUtilitySheet from "@/app/admin/tickets/utilities/components/CreateUtilitySheet";
import CreateTicketSheet from "@/app/admin/tickets/components/CreateTicketSheet";

export default function TicketsPage() {
  const headerConfig = useMemo(() => ({ title: "チケット管理", showLogo: false }), []);
  useHeaderConfig(headerConfig);
  const router = useRouter();

  const { user } = useAuth();

  const { data: utilityData, loading: utilitiesLoading, refetch: refetchUtilities } = useGetUtilitiesQuery({
    variables: {
      filter: { communityId: COMMUNITY_ID, createdBy: user?.id },
      sort: { createdAt: GqlSortDirection.Desc },
      first: 20,
    },
  });

  const { data: ticketData, refetch: refetchTickets } = useGetTicketIssuersQuery({
    variables: {
      filter: { ownerId: user?.id ?? "" },
      sort: { createdAt: GqlSortDirection.Desc },
      first: 20,
    },
  });

  const utilityList = utilityData?.utilities?.edges?.map((e) => e?.node) ?? [];
  const ticketList = ticketData?.ticketIssuers?.edges?.map((e) => e?.node) ?? [];

  if (utilitiesLoading) {
    return <LoadingIndicator />;
  }

  if (utilityList.length === 0) {
    return (
      <div className="p-4 space-y-8 max-w-2xl mx-auto">
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold">チケットの利用を始めましょう！</h2>
          <CreateUtilitySheet onUtilityCreated={ async () => {
            await refetchUtilities();
          } } />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8 max-w-2xl mx-auto">
      {/* チケットリンク一覧セクション */ }
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">チケットリンク一覧</h2>
          <CreateTicketSheet onTicketCreated={ async () => {
            await refetchTickets();
          } } />
        </div>
        <div className="flex flex-col gap-3">
          { ticketList.length === 0 ? (
            <p className="text-muted-foreground">発行リンクがありません</p>
          ) : (
            ticketList.map((ticket) => (
              <TicketIssueCard
                key={ `${ ticket?.id }-${ ticket?.claimLink?.id ?? "no-claimLink" }` }
                qtyToBeIssued={ ticket?.qtyToBeIssued }
                claimQty={ ticket?.claimLink?.qty }
                createdAt={
                  ticket?.createdAt instanceof Date
                    ? ticket.createdAt.toISOString()
                    : (ticket?.createdAt ?? "")
                }
                href={ `/admin/tickets/${ ticket?.claimLink?.id }` }
                statusVariant={
                  ticket?.claimLink?.qty != null &&
                  ticket?.qtyToBeIssued != null &&
                  ticket?.claimLink.qty < ticket?.qtyToBeIssued
                    ? "primary"
                    : "secondary"
                }
              />
            ))
          ) }
        </div>
      </div>

      {/* チケットの種類一覧セクション */ }
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">チケットの種類一覧</h2>
          <Button
            variant="text"
            onClick={ () => router.push("/admin/tickets/utilities") }
          >
            チケットの種類を管理する
          </Button>
        </div>
        <div className="space-y-2">
          { utilityList.map((utility) => (
            <CardWrapper key={ utility?.id } className="p-4">
              <div className="text-sm">
                <div className="font-semibold">{ utility?.name }</div>
                <div className="text-muted-foreground">{ utility?.description }</div>
                <div>交換ポイント: { utility?.pointsRequired }</div>
              </div>
            </CardWrapper>
          )) }
        </div>
      </div>
    </div>
  );
}
