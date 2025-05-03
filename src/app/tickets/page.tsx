'use client';

import React from 'react';
import { useTickets } from '@/hooks/useTickets';
import TicketHeader from '../components/features/ticket/TicketHeader';
import TicketContent from '../components/features/ticket/TicketContent';
import Loading from '../components/layout/Loading';
import ErrorState from '../components/shared/ErrorState';

export default function TicketsPage() {
  const { tickets, loading, error } = useTickets();

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Loading />
      </div>
    );
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <div className="min-h-screen bg-white">
      <TicketHeader />
      <TicketContent tickets={tickets} />
    </div>
  );
}
