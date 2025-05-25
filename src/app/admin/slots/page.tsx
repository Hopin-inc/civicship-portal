"use client";

import React, { useEffect, useMemo, useState } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import Link from "next/link";
import { CardWrapper } from "@/components/ui/card-wrapper";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";
import { useOpportunitySlots } from "@/hooks/useOpportunitySlots";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Users } from "lucide-react";
import { displayDuration } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GqlOpportunitySlot } from "@/types/graphql";

export default function SlotsPage() {
  const headerConfig = useMemo(
    () => ({
      title: "出欠管理",
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);
  const router = useRouter();

  const { slots, loading, error, loadMoreRef, hasMore, isLoadingMore } = useOpportunitySlots();
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0); // 時間を切り捨てて純粋な「日」だけで比較
    return d;
  }, []);

  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<"past" | "future">(
    tabParam === "future" ? "future" : "past",
  );

  useEffect(() => {
    const newTab = tabParam === "future" ? "future" : "past";
    if (activeTab !== newTab) {
      setActiveTab(newTab);
    }
  }, [tabParam, activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as "past" | "future");

    const params = new URLSearchParams(searchParams.toString());
    if (value === "past") {
      params.delete("tab"); // default
    } else {
      params.set("tab", value);
    }

    router.push(`/admin/slots?${params.toString()}`);
  };

  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => {
      const startsAtDate = slot.startsAt ? new Date(slot.startsAt) : null;
      if (!startsAtDate) return false;

      return activeTab === "past" ? startsAtDate <= today : startsAtDate > today;
    });
  }, [slots, activeTab, today]);

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
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="sticky p-4 pb-0 z-10 bg-white"
      >
        <TabsList className="mb-2">
          <TabsTrigger value="past">開催済み</TabsTrigger>
          <TabsTrigger value="future">未開催</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="space-y-4">
        {filteredSlots.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">開催日程が見つかりません</p>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredSlots.map((slot: GqlOpportunitySlot) => {
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
