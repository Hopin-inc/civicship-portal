"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoginModal from "@/app/login/components/LoginModal";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { useTicketClaim } from "@/app/tickets/hooks/useTicketClaim";
import TicketReceiveContent from "@/app/tickets/components/TicketReceiveContent";
import useHeaderConfig from "@/hooks/useHeaderConfig";

export default function TicketReceivePage() {
  const searchParams = useSearchParams();
  const ticketClaimLinkId = searchParams.get("token");
  if (!ticketClaimLinkId) {
    throw new Error("URLが無効か、既に使用されています。");
  }

  const headerConfig = useMemo(
    () => ({
      title: "チケット受け取り",
      showBackButton: true,
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const { user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { claimLinkData, hasIssued, isClaimLoading, claimTicket, viewLoading, viewError } =
    useTicketClaim(ticketClaimLinkId);

  if (viewLoading) {
    return (
      <div className="min-h-screen bg-background">
        <LoadingIndicator fullScreen={true} />
      </div>
    );
  }

  if (viewError) {
    return <ErrorState message={`エラーが発生しました: ${viewError.message}`} />;
  }

  return (
    <div className="flex flex-col h-full min-h-0 px-6 py-12 justify-center overflow-y-auto">
      <TicketReceiveContent
        user={user}
        claimLinkData={claimLinkData!}
        hasIssued={hasIssued}
        isClaimLoading={isClaimLoading}
        onClaimClick={claimTicket}
        onLoginClick={() => setIsLoginModalOpen(true)}
      />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
}
