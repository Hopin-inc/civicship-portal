"use client";

import { useEffect } from "react";
import { useHierarchicalNavigation } from "@/hooks/useHierarchicalNavigation";
import { detectEnvironment, AuthEnvironment } from "@/lib/auth/core/environment-detector";

interface SwipeBackNavigationProps {
  children: React.ReactNode;
}

/**
 * 左から右へのスワイプジェスチャーで戻る機能を提供するコンポーネント
 * LIFF環境でのみ有効化される
 */
export function SwipeBackNavigation({ children }: SwipeBackNavigationProps) {
  const { navigateBack } = useHierarchicalNavigation();

  useEffect(() => {
    const env = detectEnvironment();

    // LIFF環境でのみ有効化
    if (env !== AuthEnvironment.LIFF) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let isSwipeGesture = false;

    const handleTouchStart = (e: TouchEvent) => {
      // 画面左端50px以内からのスワイプのみ有効
      const touch = e.touches[0];
      if (touch.clientX > 50) {
        isSwipeGesture = false;
        return;
      }

      isSwipeGesture = true;
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!isSwipeGesture) return;

      const touch = e.changedTouches[0];
      const touchEndX = touch.clientX;
      const touchEndY = touch.clientY;

      const deltaX = touchEndX - touchStartX;
      const deltaY = Math.abs(touchEndY - touchStartY);

      // 横方向に100px以上、縦方向は75px未満（横スワイプ判定）
      if (deltaX > 100 && deltaY < 75) {
        e.preventDefault();
        navigateBack();
      }

      isSwipeGesture = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isSwipeGesture) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartX;

      // スワイプが逆方向に進んでいる場合はキャンセル
      if (deltaX < 0) {
        isSwipeGesture = false;
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
