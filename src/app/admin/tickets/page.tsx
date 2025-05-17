"use client";

import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { GET_TICKET_ISSUERS } from "@/graphql/reward/ticketIssuer/query";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardWrapper } from "@/components/ui/card-wrapper";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";

export default function TicketsPage() {
  const headerConfig = useMemo(() => ({
    hideHeader: true,
  }), []);
  useHeaderConfig(headerConfig);

  const { data, loading, error } = useQuery(GET_TICKET_ISSUERS);

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorState message="チケット情報の取得に失敗しました" />
      </div>
    );
  }

  const tickets = data?.ticketIssuers?.edges?.map(edge => edge.node) || [];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">チケット一覧</h1>
      <div className="space-y-4">
        {tickets.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">チケットが見つかりません</p>
        ) : (
          tickets.map((ticket) => (
            <Link key={ticket.id} href={`/admin/tickets/${ticket.id}`}>
              <CardWrapper className="p-4 cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-semibold">チケット #{ticket.id}</h2>
                    <p className="text-sm text-muted-foreground">
                      {new Date(ticket.createdAt).toLocaleDateString('ja-JP')}
                    </p>
                    <p className="text-sm mt-1">
                      <span className="font-medium">発行者:</span> {ticket.owner?.name || '未設定'}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">発行数:</span> {ticket.qtyToBeIssued}
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">詳細</Button>
                </div>
              </CardWrapper>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
