"use client";

import { usePlaceList } from "../hooks/usePlaceList";
import { PlaceItem } from "./PlaceItem";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useRef } from "react";

export function PlaceList() {
  const { places, loading, error, refetch } = usePlaceList();

  const refetchRef = useRef<(() => void) | null>(null);
  refetchRef.current = refetch;

  // 初期ロード中
  if (loading && !places) {
    return <LoadingIndicator fullScreen={false} />;
  }

  // エラー状態
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">場所の読み込みに失敗しました</p>
      </div>
    );
  }

  // データが空
  if (!places || places.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">場所がありません</p>
      </div>
    );
  }

  // データ表示（opportunitiesと同じ構造）
  return (
    <div className="flex flex-col">
      {places.map((place, idx) => (
        <div key={place.id}>
          {idx !== 0 && <hr className="border-muted" />}
          <PlaceItem place={place} refetch={refetch} />
        </div>
      ))}
    </div>
  );
}
