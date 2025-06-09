"use client";

import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
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
import Link from "next/link";

export default function TicketsPage() {
  const headerConfig = useMemo(() => ({ title: "チケット管理", showLogo: false }), []);
  useHeaderConfig(headerConfig);
  const { user } = useAuth();

  const { data: utilityData, loading: utilitiesLoading, refetch: refetchUtilities } = useGetUtilitiesQuery({
    variables: {
      filter: { communityIds: [COMMUNITY_ID], ownerIds: user?.id ? [user.id] : undefined },
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
      <div className="p-4 pb-8 space-y-4 max-w-2xl mx-auto h-[calc(100svh-64px)]">
        <div className="flex flex-col h-full w-full justify-center align-center text-center space-y-6">
          <p className="text-body-md">まずはチケットの種類を追加して、チケット機能を使ってみましょう！</p>
          <CreateUtilitySheet buttonLabel="利用開始" onUtilityCreated={ async () => {
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
        <p className="text-body-sm text-muted-foreground">
          発行するチケットの種類は
          <Link href="/admin/tickets/utilities" className="text-primary hover:text-primary-hover underline">こちら</Link>
          から確認・追加できます。
        </p>
        <div className="flex flex-col gap-3">
          { ticketList.length === 0 ? (
            <p className="text-muted-foreground">発行リンクがありません</p>
          ) : (
            ticketList.map((ticket) => (
              <TicketIssueCard
                key={ `${ ticket?.id }-${ ticket?.claimLink?.id ?? "no-claimLink" }` }
                title={ ticket?.utility?.name ?? "名称未設定のチケット" }
                qty={ ticket?.claimLink?.qty }
                createdAt={
                  ticket?.createdAt instanceof Date
                    ? ticket.createdAt.toISOString()
                    : (ticket?.createdAt ?? "")
                }
                href={ `/admin/tickets/${ ticket?.claimLink?.id }` }
                status={ ticket?.claimLink?.status }
              />
            ))
          ) }
        </div>
      </div>
    </div>
  );
}
