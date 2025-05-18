"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardWrapper } from "@/components/ui/card-wrapper";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { useReservations } from "@/hooks/useReservations";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ReservationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState<string>(
    tabParam && ["all", "pending", "processed"].includes(tabParam) ? tabParam : "all"
  );

  useEffect(() => {
    const newTab = tabParam && ["all", "pending", "processed"].includes(tabParam) ? tabParam : "all";
    if (activeTab !== newTab) {
      setActiveTab(newTab);
    }
  }, [tabParam, activeTab]);

  const headerConfig = useMemo(() => ({
    title: "応募管理",
    showLogo: false,
  }), []);
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

  const { reservations, loading, error, loadMoreRef, hasMore, isLoadingMore } = useReservations(statusFilter);

  if (loading && reservations.length === 0) {
    return (
      <div className="p-4 flex justify-center items-center h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorState message="応募情報の取得に失敗しました" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">応募一覧</h1>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-4">
        <TabsList className="mb-2">
          <TabsTrigger value="all">すべて</TabsTrigger>
          <TabsTrigger value="pending">未対応</TabsTrigger>
          <TabsTrigger value="processed">対応済み</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {reservations.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">応募が見つかりません</p>
        ) : (
          <>
            {reservations.map((reservation: any) => (
              <Link key={reservation.id} href={`/admin/reservations/${reservation.id}`}>
                <CardWrapper className="p-4 cursor-pointer">
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-between items-center">
                      {/* 予約者情報 */}
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={reservation.createdByUser?.image || ""} />
                          <AvatarFallback>{reservation.createdByUser?.name?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{reservation.createdByUser?.name || "未設定"}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(reservation.createdAt).toLocaleDateString('ja-JP')}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm px-2 py-0.5 bg-secondary inline-block rounded-full">
                        {reservation.status}
                      </p>
                    </div>
                    
                    {/* 予約情報 */}
                    <div className="text-sm space-y-1">
                      <p><span className="font-medium">機会:</span> {reservation.opportunitySlot?.opportunity?.title}</p>
                      <p><span className="font-medium">予約した日程:</span> {
                        reservation.opportunitySlot?.startsAt && 
                        `${new Date(reservation.opportunitySlot.startsAt).toLocaleDateString('ja-JP')} ${new Date(reservation.opportunitySlot.startsAt).toLocaleTimeString('ja-JP', {hour: '2-digit', minute:'2-digit'})} 〜 ${new Date(reservation.opportunitySlot.endsAt).toLocaleTimeString('ja-JP', {hour: '2-digit', minute:'2-digit'})}`
                      }</p>
                      <p><span className="font-medium">参加人数:</span> {reservation.participations?.length || 0}名</p>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button variant="secondary" size="sm">詳細</Button>
                    </div>
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
