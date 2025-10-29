"use client";

import React from "react";
import TicketList from "./TicketList";
import { TicketClaimLink } from "@/app/tickets/data/type";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { Info, Search } from "lucide-react";
import { getCurrentRegionName, currentCommunityConfig } from "@/lib/communities/metadata";
import Link from "next/link";

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
    <main className="pt-6 px-4">
      <div className="mb-6">
        <div className="bg-muted rounded-xl p-4">
          <div className="flex items-start gap-2">
            <Info className="min-w-5 w-5 h-5 text-muted-foreground mt-0.5" />
            <div className="flex-grow">
              <h2 className="text-base font-bold mb-1">チケットとは</h2>
              <p className="text-muted-foreground leading-relaxed">
                チケットを送ってくれた人が主催する体験に無料で参加することができます。
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
        <Empty className="mt-8">
          <EmptyHeader>
            <EmptyMedia variant="gradient">
              <Search className="h-8 w-8" />
            </EmptyMedia>
            <EmptyDescription>
              {getCurrentRegionName()}の素敵な人と関わって
              <br />
              チケットをもらおう
            </EmptyDescription>
          </EmptyHeader>
          {currentCommunityConfig.enableFeatures.includes("opportunities") && (
            <EmptyContent>
              <Button asChild variant="primary" size="lg" className="px-16">
                <Link href={currentCommunityConfig.rootPath ?? "/"}>
                  関わりをみつける
                </Link>
              </Button>
            </EmptyContent>
          )}
        </Empty>
      )}
    </main>
  );
};

export default TicketContent;
