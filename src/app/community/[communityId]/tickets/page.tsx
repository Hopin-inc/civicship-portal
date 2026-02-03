"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useTicketClaimLinks } from "@/app/community/[communityId]/tickets/hooks/useTicketClaimLinks";
import TicketContent from "@/app/community/[communityId]/tickets/components/TicketContent";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { ErrorState } from '@/components/shared'

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

  const { ticketClaimLinks, loading, error, refetch, loadMoreRef, hasNextPage } = useTicketClaimLinks();
  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  if (loading && ticketClaimLinks.length === 0) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorState title={"チケットページを読み込めませんでした"} refetchRef={refetchRef} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <TicketContent 
        ticketClaimLinks={ticketClaimLinks} 
        loadMoreRef={loadMoreRef} 
        hasNextPage={hasNextPage} 
        loading={loading} 
      />
      {hasNextPage && (
        <div ref={loadMoreRef} className="py-4 text-center mt-4">
          {loading ? (
            <div className="py-2">
              <LoadingIndicator fullScreen={false} />
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">スクロールしてさらに読み込み...</p>
          )}
        </div>
      )}
    </div>
  );
}
