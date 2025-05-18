"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useTickets } from "@/app/tickets/hooks/useTickets";
import TicketContent from "@/app/tickets/components/TicketContent";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import ErrorState from "@/components/shared/ErrorState";

export default function TicketsPage() {
  const headerConfig = useMemo(
    () => ({
      title: "チケット一覧",
      showBackButton: true,
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const { tickets, loading, error, refetch } = useTickets();
  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorState title={"チケットページを読み込めませんでした"} refetchRef={refetchRef} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <TicketContent tickets={tickets} />
    </div>
  );
}
