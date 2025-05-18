"use client";

import { useMemo, useState } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardWrapper } from "@/components/ui/card-wrapper";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { useReservations } from "@/hooks/useReservations";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReservationsPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const headerConfig = useMemo(() => ({
    hideHeader: true,
  }), []);
  useHeaderConfig(headerConfig);

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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
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
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="font-semibold">応募 #{reservation.id}</h2>
                      <p className="text-sm text-muted-foreground">
                        {new Date(reservation.createdAt).toLocaleDateString('ja-JP')}
                      </p>
                      <p className="text-sm mt-1 px-2 py-0.5 bg-secondary inline-block rounded-full">
                        {reservation.status}
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
