'use client';

import React from 'react';
import { useTickets } from '@/hooks/features/ticket/useTickets';
import TicketContent from '@/components/features/ticket/TicketContent';
import { LoadingIndicator } from '@/components/shared/LoadingIndicator';
import { ErrorState } from '@/components/shared/ErrorState';

export default function TicketsPage() {
  const { tickets, loading, error } = useTickets();

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
