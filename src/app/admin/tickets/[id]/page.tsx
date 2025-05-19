"use client";

import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { VIEW_TICKET_CLAIM } from "@/graphql/reward/ticketClaimLink/query";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { CardWrapper } from "@/components/ui/card-wrapper";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import dynamic from "next/dynamic";

const QRCode = dynamic(() => import("react-qr-code"), { ssr: false });

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const headerConfig = useMemo(() => ({
    title: `チケット ${params.id}`,
    showBackButton: true,
    backTo: "/admin/tickets",
  }), [params.id]);
  useHeaderConfig(headerConfig);

  const { data, loading, error } = useQuery(VIEW_TICKET_CLAIM, {
    variables: { id: params.id },
  });

  if (loading) {
    return (
      <div className="p-4 pt-16 flex justify-center items-center h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 pt-16">
        <ErrorState message="チケット情報の取得に失敗しました" />
      </div>
    );
  }

  const ticketClaimLink = data?.ticketClaimLink;
  if (!ticketClaimLink) {
    return (
      <div className="p-4 pt-16">
        <ErrorState message="チケットが見つかりません" />
      </div>
    );
  }

  const qrUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/tickets/receive?id=${params.id}`
    : '';

  return (
    <div className="p-4 pt-16">
      <CardWrapper className="p-4 mb-4">
        <h1 className="text-xl font-bold mb-4">チケットQRコード</h1>
        
        <div className="flex flex-col items-center mb-4">
          <div className="bg-white p-4 rounded-lg mb-2">
            {qrUrl && <QRCode value={qrUrl} size={200} />}
          </div>
          <p className="text-sm text-center text-muted-foreground">{qrUrl}</p>
        </div>
        
        <div className="space-y-2 mt-4">
          <p><span className="font-medium">ステータス:</span> {ticketClaimLink.status}</p>
          <p><span className="font-medium">発行枚数:</span> {ticketClaimLink.qty}</p>
          {ticketClaimLink.issuer?.owner && (
            <p>
              <span className="font-medium">発行者:</span> {ticketClaimLink.issuer.owner.name || '未設定'}
            </p>
          )}
        </div>
      </CardWrapper>
    </div>
  );
}
