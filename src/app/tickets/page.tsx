'use client';

import React, { useMemo } from 'react';
import { useTickets } from '@/hooks/features/ticket/useTickets';
import TicketContent from '@/components/features/ticket/TicketContent';
import LoadingIndicator from '@/components/shared/LoadingIndicator';
import { ErrorState } from '@/components/shared/ErrorState';
import { useHeaderConfig } from '@/hooks/core/useHeaderConfig';

export default function TicketsPage() {
  const { tickets, loading, error } = useTickets();
  
  const headerConfig = useMemo(() => ({
    title: "チケット一覧",
    showBackButton: true,
    showLogo: false,
  }), []);
  useHeaderConfig(headerConfig);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <LoadingIndicator fullScreen={true} />
      </div>
    );
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="min-h-screen bg-background">
      <TicketContent tickets={tickets} />
    </div>
  );
}
