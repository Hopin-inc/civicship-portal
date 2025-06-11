"use client";

import React from "react";
import TicketList from "./TicketList";
import { TTicket } from "@/app/tickets/data/type";
import EmptyStateWithSearch from "@/components/shared/EmptyStateWithSearch";
import { Info } from "lucide-react";

interface TicketContentProps {
  tickets: TTicket[];
}

const TicketContent: React.FC<TicketContentProps> = ({ tickets }) => {
  return (
    <main className="pt-14 px-4">
      <div className="mb-6">
        <div className="bg-muted rounded-[20px] p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <h2 className="text-base font-bold mb-1">チケットとは</h2>
              <p className="text-muted-foreground leading-relaxed">
                チケットを送ってくれた人が主催する体験に無料で参加することができます。
              </p>
            </div>
          </div>
        </div>
      </div>

      {tickets.length > 0 ? <TicketList tickets={tickets} /> : <EmptyStateWithSearch />}
    </main>
  );
};

export default TicketContent;
