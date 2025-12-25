"use client";

import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { GqlReservation } from "@/types/graphql";
import { ReservationItem } from "./ReservationItem";

interface ReservationListProps {
  reservations: GqlReservation[];
  loading: boolean;
  error: any;
  loadMoreRef: React.RefObject<HTMLDivElement>;
}

export function ReservationList({
  reservations,
  loading,
  error,
  loadMoreRef,
}: ReservationListProps) {
  // 初期ロード中
  if (loading && reservations.length === 0) {
    return (
      <div className="p-4 flex justify-center items-center h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  // エラー状態
  if (error) {
    return (
      <div className="p-4">
        <ErrorState title="予約の取得に失敗しました" />
      </div>
    );
  }

  // データが空
  if (reservations.length === 0) {
    return <p className="text-center text-muted-foreground py-8">予約がありません</p>;
  }

  // データ表示
  return (
    <>
      <div className="flex flex-col gap-2">
        {reservations.map((reservation: GqlReservation) => (
          <ReservationItem
            key={reservation.id}
            reservation={reservation}
          />
        ))}

        <div ref={loadMoreRef} className="h-0" aria-hidden="true" />
        {loading && (
          <div className="h-10 flex items-center justify-center">
            <div className="animate-spin h-6 w-6 border-b-2 border-foreground rounded-full"></div>
          </div>
        )}
      </div>
    </>
  );
}
