"use client";

import React, { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import Link from "next/link";
import { CardWrapper } from "@/components/ui/card-wrapper";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";
import { useOpportunitySlots } from "@/hooks/useOpportunitySlots";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Users } from "lucide-react";
import { displayDuration } from "@/utils";

export default function SlotsPage() {
  const headerConfig = useMemo(
    () => ({
      title: "出欠管理",
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const { slots, loading, error, loadMoreRef, hasMore, isLoadingMore } = useOpportunitySlots();
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

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
          <div className="flex flex-col gap-4">
            {slots.map((slot: any) => {
              const startsAtDate = slot.startsAt ? new Date(slot.startsAt) : null;
              const isFuture = startsAtDate ? startsAtDate > today : false;

              return (
                <Link key={slot.id} href={`/admin/slots/${slot.id}`} tabIndex={isFuture ? -1 : 0}>
                  <CardWrapper
                    className={`p-4 ${isFuture ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                    clickable={!isFuture}
                  >
                    <div className="flex flex-col space-y-3">
                      <div className="space-y-1">
                        {!isFuture && (
                          <Badge
                            variant="colored"
                            color={slot.isFullyEvaluated ? "success" : "danger"}
                          >
                            {slot.isFullyEvaluated ? "確定済み" : "要入力"}
                          </Badge>
                        )}
                        <h2 className="font-semibold">
                          {slot.opportunity?.title || "無題のイベント"}
                        </h2>
                      </div>
                      <div className="flex flex-col flex-wrap text-body-sm gap-1">
                        <p className="inline-flex items-center gap-1">
                          <CalendarIcon size="16" />
                          {slot.startsAt && displayDuration(slot.startsAt, slot.endsAt)}
                        </p>
                        <div className="flex flex-wrap text-body-sm gap-x-4 gap-y-1">
                          <p className="inline-flex items-center gap-1">
                            <Users size="16" />
                            {slot.numParticipants}名
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardWrapper>
                </Link>
              );
            })}
            <div ref={loadMoreRef} className="py-4 flex justify-center">
              {hasMore &&
                (isLoadingMore ? (
                  <LoadingIndicator />
                ) : (
                  <p className="text-sm text-muted-foreground">スクロールして続きを読み込む</p>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
