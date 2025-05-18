"use client";

import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardWrapper } from "@/components/ui/card-wrapper";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { useReservations } from "@/hooks/useReservations";

export default function ReservationsPage() {
  const headerConfig = useMemo(() => ({
    hideHeader: true,
  }), []);
  useHeaderConfig(headerConfig);

  const { reservations, loading, error, loadMoreRef, hasMore, isLoadingMore } = useReservations();

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
