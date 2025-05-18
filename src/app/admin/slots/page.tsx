"use client";

import React, { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardWrapper } from "@/components/ui/card-wrapper";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { format } from "date-fns";
import { useOpportunitySlots } from "@/hooks/useOpportunitySlots";

export default function SlotsPage() {
  const headerConfig = useMemo(() => ({
    hideHeader: true,
  }), []);
  useHeaderConfig(headerConfig);

  const { slots, loading, error, loadMoreRef, hasMore, isLoadingMore } = useOpportunitySlots();

  if (loading && slots.length === 0) {
    return (
      <div className="p-4 flex justify-center items-center h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorState message="開催日程の取得に失敗しました" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">開催日程一覧</h1>
      <div className="space-y-4">
        {slots.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">開催日程が見つかりません</p>
        ) : (
          <>
            {slots.map((slot: any) => (
              <Link key={slot.id} href={`/admin/slots/${slot.id}`}>
                <CardWrapper className="p-4 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="font-semibold">{slot.opportunity?.title || '無題のイベント'}</h2>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(slot.startsAt || slot.startAt), 'yyyy/MM/dd HH:mm')} 〜 {format(new Date(slot.endsAt || slot.endAt), 'HH:mm')}
                      </p>
                      <p className="text-sm mt-1">
                        <span className="font-medium">定員:</span> {slot.capacity}名
                        ({slot.capacity - slot.remainingCapacity}/{slot.capacity})
                      </p>
                    </div>
                    <Button variant="secondary" size="sm">詳細</Button>
                  </div>
                </CardWrapper>
              </Link>
            ))}
            
            {/* Infinite scroll loading ref */}
            <div ref={loadMoreRef} className="py-4 flex justify-center">
              {hasMore && (
                isLoadingMore ? <LoadingIndicator /> : <p className="text-sm text-muted-foreground">スクロールして続きを読み込む</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
