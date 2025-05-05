'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import TicketDetailHeader from '@/app/components/features/ticket/TicketDetailHeader';
import TicketDetailProfile from '@/app/components/features/ticket/TicketDetailProfile';
import TicketDetailInfo from '@/app/components/features/ticket/TicketDetailInfo';
import TicketDetailRequests from '@/app/components/features/ticket/TicketDetailRequests';
import TicketDetailAction from '@/app/components/features/ticket/TicketDetailAction';
import { useTicketDetail } from '@/hooks/features/ticket/useTicketDetail';
import { LoadingIndicator } from '@/app/components/shared/LoadingIndicator';
import { ErrorState } from '@/app/components/shared/ErrorState';

export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params?.id as string;
  
  const { 
    isLoading, 
    error, 
    ticketDetail, 
    findRelatedOpportunities 
  } = useTicketDetail(ticketId);

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
    <div className="min-h-screen bg-white">
      <TicketDetailHeader 
        eventName={ticketDetail.eventName || "イベント"} 
        eventUrl={ticketDetail.eventUrl}
      />

      <main className="pt-20 px-4 pb-6">
        <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
          <TicketDetailProfile 
            hostName={ticketDetail.hostName} 
            hostImage={ticketDetail.hostImage || "/placeholder-profile.jpg"} 
          />

          <TicketDetailInfo 
            ticketCount={ticketDetail.ticketCount} 
            purpose={ticketDetail.purpose} 
          />

          <TicketDetailRequests 
            requests={ticketDetail.requests} 
          />

          <TicketDetailAction 
            onFindRelatedOpportunities={findRelatedOpportunities} 
          />
        </div>
      </main>
    </div>
  );
}
