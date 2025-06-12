"use client";

import React from "react";
import TicketList from "./TicketList";
import { TicketClaimLink } from "@/app/tickets/data/type";
import EmptyStateWithSearch from "@/components/shared/EmptyStateWithSearch";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { Info } from "lucide-react";

interface TicketContentProps {
  ticketClaimLinks: TicketClaimLink[];
  loadMoreRef: React.RefObject<HTMLDivElement>;
  hasNextPage: boolean;
  loading: boolean;
}

const TicketContent: React.FC<TicketContentProps> = ({ 
  ticketClaimLinks, 
  loadMoreRef, 
  hasNextPage, 
  loading 
}) => {
  return (
    <main className="pt-14 px-4">
      <div className="mb-6">
        <div className="bg-muted rounded-[20px] p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <h2 className="text-base font-bold mb-1">チケットとは</h2>
              <p className="text-muted-foreground leading-relaxed">
                チケットを送ってくれた人が主催する体験に
                <br />
                無料で参加することができます。
              </p>
            </div>
          </div>
        </div>
      </div>

      {ticketClaimLinks.length > 0 ? (
        <>
          <TicketList tickets={ticketClaimLinks} />
          {hasNextPage && (
            <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
              {loading && <LoadingIndicator />}
            </div>
          )}
        </>
      ) : (
        <EmptyStateWithSearch />
      )}
    </main>
  );
};

export default TicketContent;
