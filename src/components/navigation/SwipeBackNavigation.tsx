"use client";

import { useEffect, useRef } from "react";
import { useHierarchicalNavigation } from "@/hooks/useHierarchicalNavigation";
import { detectEnvironment, AuthEnvironment } from "@/lib/auth/core/environment-detector";

// スワイプジェスチャーの判定定数
const SWIPE_START_AREA_WIDTH = 50; // 画面左端からの有効エリア (px)
const MIN_SWIPE_DISTANCE_X = 100; // 最小横方向スワイプ距離 (px)
const MAX_SWIPE_DISTANCE_Y = 75; // 最大縦方向移動距離 (px)

interface SwipeBackNavigationProps {
  children: React.ReactNode;
}

/**
 * 左から右へのスワイプジェスチャーで戻る機能を提供するコンポーネント
 * LIFF環境でのみ有効化される
 */
export function SwipeBackNavigation({ children }: SwipeBackNavigationProps) {
  const { navigateBack } = useHierarchicalNavigation();
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchId = useRef<number | null>(null);
  const isSwipeGesture = useRef(false);

  useEffect(() => {
    const env = detectEnvironment();

    // LIFF環境でのみ有効化
    if (env !== AuthEnvironment.LIFF) return;

    const cancelSwipe = () => {
      isSwipeGesture.current = false;
      touchId.current = null;
    };

    const handleTouchStart = (e: TouchEvent) => {
      // マルチタッチ時または既にスワイプ中の場合は無視
      if (isSwipeGesture.current || e.touches.length > 1) return;

      const touch = e.touches[0];
      // 画面左端からSWIPE_START_AREA_WIDTH以内からのスワイプのみ有効
      if (touch.clientX > SWIPE_START_AREA_WIDTH) return;

      isSwipeGesture.current = true;
      touchId.current = touch.identifier;
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isSwipeGesture.current) return;

      // identifier が一致するタッチを探す
      const touch = Array.from(e.changedTouches).find((t) => t.identifier === touchId.current);

      // ジェスチャーが終了したので状態をリセット
      cancelSwipe();

      if (!touch) return;

      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = Math.abs(touch.clientY - touchStartY.current);

      // 横方向にMIN_SWIPE_DISTANCE_X以上、縦方向はMAX_SWIPE_DISTANCE_Y未満（横スワイプ判定）
      if (deltaX > MIN_SWIPE_DISTANCE_X && deltaY < MAX_SWIPE_DISTANCE_Y) {
        e.preventDefault();
        navigateBack();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isSwipeGesture.current) return;

      // identifier が一致するタッチを探す
      const touch = Array.from(e.touches).find((t) => t.identifier === touchId.current);
      if (!touch) {
        cancelSwipe();
        return;
      }

      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = Math.abs(touch.clientY - touchStartY.current);

      // スワイプが逆方向または垂直方向に進んでいる場合はキャンセル
      if (deltaX < 0 || deltaY > MAX_SWIPE_DISTANCE_Y) {
        cancelSwipe();
      }
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [navigateBack]);

  return <>{children}</>;
}
