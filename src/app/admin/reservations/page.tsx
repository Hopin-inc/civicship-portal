"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import Link from "next/link";
import { CardWrapper } from "@/components/ui/card-wrapper";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";
import { useReservations } from "@/hooks/useReservations";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { displayDuration, displayRelativeTime } from "@/utils";
import { ReservationStatus } from "@/app/admin/reservations/components/ReservationStatus";
import { Bookmark, CalendarIcon, Info, User } from "lucide-react";

export default function ReservationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<string>(
    tabParam && ["all", "pending", "processed"].includes(tabParam) ? tabParam : "all",
  );

  useEffect(() => {
    const newTab =
      tabParam && ["all", "pending", "processed"].includes(tabParam) ? tabParam : "all";
    if (activeTab !== newTab) {
      setActiveTab(newTab);
    }
  }, [tabParam, activeTab]);

  const headerConfig = useMemo(
    () => ({
      title: "応募管理",
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const handleTabChange = (value: string) => {
    setActiveTab(value);

    const params = new URLSearchParams(searchParams.toString());

    if (value === "all") {
      params.delete("tab"); // Remove tab parameter for default tab
    } else {
      params.set("tab", value);
    }

    router.push(`/admin/reservations?${params.toString()}`);
  };

  const statusFilter = useMemo(() => {
    if (activeTab === "pending") return "APPLIED";
    if (activeTab === "processed") return "NOT_APPLIED";
    return null;
  }, [activeTab]);

  const { reservations, loading, error, loadMoreRef, hasMore, isLoadingMore } =
    useReservations(statusFilter);

  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorState title="応募情報の取得に失敗しました" />
      </div>
    );
  }

  return (
    <>
      <div className="p-3 rounded-xl border-[1px] border-zinc-300 bg-zinc-50 mt-6">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 mt-[3px] text-zinc-600" />
          <div className="flex-1">
            <p className="font-bold leading-6 text-zinc-800">操作のご案内</p>
            <p className="text-sm text-zinc-700 mt-1">
              応募が届くと一覧画面に表示されます。タップすると詳細画面で操作できます。
            </p>
          </div>
        </div>
      </div>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="sticky p-4 pb-0">
        <TabsList className="mb-2">
          <TabsTrigger value="all">すべて</TabsTrigger>
          <TabsTrigger value="pending">未対応</TabsTrigger>
          {/*<TabsTrigger value="processed">対応済み</TabsTrigger>*/}
        </TabsList>
      </Tabs>

      <div className="flex flex-col gap-4 p-4">
        {reservations.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">応募が見つかりません</p>
        ) : (
          <>
            {reservations.map((reservation: any) => (
              <Link key={reservation.id} href={`/admin/reservations/${reservation.id}`}>
                <CardWrapper className="p-4 cursor-pointer" clickable>
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={reservation.createdByUser?.image || ""} />
                        <AvatarFallback>
                          {reservation.createdByUser?.name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-row content-center gap-2 flex-grow">
                        <p className="text-label-md my-auto">
                          {reservation.createdByUser?.name || "未設定"}
                        </p>
                      </div>
                      <ReservationStatus status={reservation.status} />
                    </div>

                    {/* 予約情報 */}
                    <div className="flex flex-col flex-wrap text-body-sm gap-1">
                      <p className="inline-flex items-center gap-1">
                        <Bookmark size="16" />
                        {reservation.opportunitySlot?.opportunity?.title}
                      </p>
                      <div className="flex flex-wrap text-body-sm gap-x-4 gap-y-1">
                        <p className="inline-flex items-center gap-1">
                          <CalendarIcon size="16" />
                          {reservation.opportunitySlot?.startsAt &&
                            displayDuration(
                              reservation.opportunitySlot.startsAt,
                              reservation.opportunitySlot.endsAt,
                            )}
                        </p>
                        <p className="inline-flex items-center gap-1">
                          <User size="16" />
                          {reservation.participations?.length || 0}名
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {displayRelativeTime(reservation.createdAt)}
                    </p>
                  </div>
                </CardWrapper>
              </Link>
            ))}

            {/* Infinite scroll loading ref */}
            <div ref={loadMoreRef} className="py-4 flex justify-center">
              {hasMore &&
                (isLoadingMore ? (
                  <LoadingIndicator />
                ) : (
                  <p className="text-sm text-muted-foreground">スクロールして続きを読み込む</p>
                ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
