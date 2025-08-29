"use client";

import { useEffect, useRef } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthEnvironment } from "@/lib/auth/environment-detector";
import { logger } from "@/lib/logging";

interface UseLiffPreloadProps {
  environment: AuthEnvironment;
  liffService: LiffService;
}

/**
 * LIFFのプリロード機能を提供するフック
 * バックグラウンドでLIFFを初期化し、認証が必要なページへの遷移を高速化
 */
export const useLiffPreload = ({ environment, liffService }: UseLiffPreloadProps) => {
  const preloadAttemptedRef = useRef(false);

  useEffect(() => {
    if (environment !== AuthEnvironment.LIFF || preloadAttemptedRef.current) {
      return;
    }

    const preloadLiff = async () => {
      preloadAttemptedRef.current = true;
      
      try {
        // バックグラウンドでLIFFを初期化
        const success = await liffService.initialize();
        
        if (success) {
          logger.debug("LIFF preload successful", {
            component: "useLiffPreload",
          });
        } else {
          logger.debug("LIFF preload failed (expected in some environments)", {
            component: "useLiffPreload",
          });
        }
      } catch (error) {
        // プリロードの失敗は通常の動作に影響しない
        logger.debug("LIFF preload error (non-critical)", {
          error: error instanceof Error ? error.message : String(error),
          component: "useLiffPreload",
        });
      }
    };

    // アイドル時間を利用してプリロード
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => preloadLiff());
    } else {
      // requestIdleCallbackが利用できない場合は遅延実行
      setTimeout(preloadLiff, 1000);
    }
  }, [environment, liffService]);
};
