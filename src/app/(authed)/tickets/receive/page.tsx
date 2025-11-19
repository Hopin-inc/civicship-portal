"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import LoginModal from "@/app/(auth-flow)/login/components/LoginModal";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useTicketClaim } from "@/app/tickets/receive/hooks/useTicketClaim";
import TicketReceiveContent from "@/app/tickets/receive/components/TicketReceiveContent";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { ErrorState } from '@/components/shared'
import { toast } from "react-toastify";
import { RawURIComponent } from "@/utils/path";

export default function TicketReceivePage() {
  const searchParams = useSearchParams();
  const ticketClaimLinkId = searchParams.get("token");
  if (!ticketClaimLinkId) {
    toast.error("URLが無効か、既に使用されています。");
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

  if (!ticketClaimLinkId) {
    return <ErrorState title="このチケット受け取りリンクは無効か、すでに使用済みです" />;
  }

  if (viewLoading) {
    return <LoadingIndicator />;
  }

  if (!claimLinkData) {
    return <ErrorState title="このリンクは無効か、チケット情報が確認できませんでした" />;
  }

  if (viewError) {
    return <ErrorState title="チケットを読み込めませんでした" />;
  }

  return (
    <div className="flex flex-col h-full min-h-0 px-6 py-12 justify-center overflow-y-auto">
      <TicketReceiveContent
        user={ user }
        claimLinkData={ claimLinkData! }
        hasIssued={ hasIssued }
        isClaimLoading={ isClaimLoading }
        onClaimClick={ claimTicket }
        onLoginClick={ () => setIsLoginModalOpen(true) }
      />
      <LoginModal
        isOpen={ isLoginModalOpen }
        onClose={ () => setIsLoginModalOpen(false) }
        nextPath={ window.location.pathname + window.location.search as RawURIComponent }
      />
    </div>
  );
}
