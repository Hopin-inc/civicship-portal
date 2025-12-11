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
  const isSwipeGesture = useRef(false);

  useEffect(() => {
    const env = detectEnvironment();

    // LIFF環境でのみ有効化
    if (env !== AuthEnvironment.LIFF) return;

    const handleTouchStart = (e: TouchEvent) => {
      // 画面左端からSWIPE_START_AREA_WIDTH以内からのスワイプのみ有効
      const touch = e.touches[0];
      if (touch.clientX > SWIPE_START_AREA_WIDTH) {
        isSwipeGesture.current = false;
        return;
      }

      isSwipeGesture.current = true;
      touchStartX.current = touch.clientX;
      touchStartY.current = touch.clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isSwipeGesture.current) return;

      const touch = e.changedTouches[0];
      const touchEndX = touch.clientX;
      const touchEndY = touch.clientY;

      const deltaX = touchEndX - touchStartX.current;
      const deltaY = Math.abs(touchEndY - touchStartY.current);

      // 横方向にMIN_SWIPE_DISTANCE_X以上、縦方向はMAX_SWIPE_DISTANCE_Y未満（横スワイプ判定）
      if (deltaX > MIN_SWIPE_DISTANCE_X && deltaY < MAX_SWIPE_DISTANCE_Y) {
        e.preventDefault();
        navigateBack();
      }

      isSwipeGesture.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isSwipeGesture.current) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartX.current;

      // スワイプが逆方向に進んでいる場合はキャンセル
      if (deltaX < 0) {
        isSwipeGesture.current = false;
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
