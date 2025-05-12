"use client";

import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import { TicketDetailHeader } from "@/app/tickets/components/TicketDetailHeader";
import { TicketDetailProfile } from "@/app/tickets/components/TicketDetailProfile";
import { TicketDetailInfo } from "@/app/tickets/components/TicketDetailInfo";
import { TicketDetailRequests } from "@/app/tickets/components/TicketDetailRequests";
import { TicketDetailAction } from "@/app/tickets/components/TicketDetailAction";
import { useTicketDetail } from "@/app/tickets/hooks/useTicketDetail";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import useHeaderConfig from "@/hooks/useHeaderConfig";

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params?.id as string;

  const headerConfig = useMemo(
    () => ({
      title: "チケット詳細",
      showBackButton: true,
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const { isLoading, error, ticketDetail, findRelatedOpportunities } = useTicketDetail(ticketId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  if (error || !ticketDetail) {
    return (
      <div className="min-h-screen p-4">
        <ErrorState
          title="チケット情報の取得に失敗しました"
          message={error || "チケットが見つかりませんでした。"}
          actionText="トップに戻る"
          actionHref="/"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TicketDetailHeader
        eventName={ticketDetail.eventName || "イベント"}
        eventUrl={ticketDetail.eventUrl}
      />

      <main className="pt-20 px-4 pb-6">
        <div className="bg-background rounded-lg p-6 max-w-md mx-auto">
          <TicketDetailProfile
            hostName={ticketDetail.hostName}
            hostImage={ticketDetail.hostImage || "/placeholder-profile.jpg"}
          />

          <TicketDetailInfo ticketCount={ticketDetail.ticketCount} purpose={ticketDetail.purpose} />

          <TicketDetailRequests requests={ticketDetail.requests} />

          <TicketDetailAction onFindRelatedOpportunities={findRelatedOpportunities} />
        </div>
      </main>
    </div>
  );
}
