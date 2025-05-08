'use client';

import React from 'react';
import TicketList from './TicketList';
import EmptyState from '../../shared/EmptyState';
import TicketDescription from './TicketDescription';
import { Ticket } from '@/types/ticket';

interface TicketContentProps {
  tickets: Ticket[];
}

const TicketContent: React.FC<TicketContentProps> = ({ tickets }) => {
  return (
    <main className="pt-14 px-4">
      <div className="mb-6">
        <TicketDescription />
      </div>

      {tickets.length > 0 ? (
        <TicketList tickets={tickets} />
      ) : (
        <EmptyState />
      )}
    </main>
  );
};

export default TicketContent;
