"use client";

import React, { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardWrapper } from "@/components/ui/card-wrapper";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";
import { format } from "date-fns";
import { useOpportunitySlots } from "@/hooks/useOpportunitySlots";
import { Badge } from "@/components/ui/badge";

export default function SlotsPage() {
  const headerConfig = useMemo(() => ({
    title: "出欠管理",
    showLogo: false,
  }), []);
  useHeaderConfig(headerConfig);

  const { slots, loading, error, loadMoreRef, hasMore, isLoadingMore } = useOpportunitySlots();

  const getEvaluationProgress = (slot: any) => {
    if (!slot.reservations || slot.reservations.length === 0) {
      return { total: 0, evaluated: 0, progress: 0 };
    }

    let totalParticipations = 0;
    let evaluatedParticipations = 0;

    slot.reservations.forEach((reservation: any) => {
      if (reservation.participations && reservation.participations.length > 0) {
        reservation.participations.forEach((participation: any) => {
          totalParticipations++;
          if (participation.evaluation &&
              (participation.evaluation.status === "PASSED" ||
               participation.evaluation.status === "FAILED")) {
            evaluatedParticipations++;
          }
        });
      }
    });

    const progress = totalParticipations > 0
      ? Math.round((evaluatedParticipations / totalParticipations) * 100)
      : 0;

    return { total: totalParticipations, evaluated: evaluatedParticipations, progress };
  };

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
        <ErrorState title="開催日程の取得に失敗しました" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="space-y-4">
        {slots.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">開催日程が見つかりません</p>
        ) : (
          <>
            {slots.map((slot: any) => {
              const evaluationProgress = getEvaluationProgress(slot);
              return (
                <Link key={slot.id} href={`/admin/slots/${slot.id}`}>
                  <CardWrapper className="p-4 cursor-pointer">
                    <div className="flex flex-col space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="font-semibold">{slot.opportunity?.title || '無題のイベント'}</h2>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(slot.startsAt || slot.startAt), 'yyyy/MM/dd HH:mm')} 〜 {format(new Date(slot.endsAt || slot.endAt), 'HH:mm')}
                          </p>
                        </div>
                        <Badge variant={slot.hostingStatus === "COMPLETED" ? "success" :
                                        slot.hostingStatus === "CANCELLED" ? "destructive" :
                                        "secondary"}>
                          {slot.hostingStatus}
                        </Badge>
                      </div>

                      <div className="text-sm space-y-1">
                        <p>
                          <span className="font-medium">定員:</span> {slot.capacity}名
                          ({slot.capacity - slot.remainingCapacity}/{slot.capacity})
                        </p>
                        <p>
                          <span className="font-medium">出欠管理:</span> {evaluationProgress.evaluated}/{evaluationProgress.total}名
                          ({evaluationProgress.progress}%)
                        </p>
                      </div>

                      <div className="flex justify-end">
                        <Button variant="secondary" size="sm">詳細</Button>
                      </div>
                    </div>
                  </CardWrapper>
                </Link>
              );
            })}

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
