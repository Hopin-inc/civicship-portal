"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthEnvironment } from "@/lib/auth/environment-detector";
import { isAuthRequiredForPath } from "@/config/auth-config";
import { logger } from "@/lib/logging";

interface UseAuthPredictiveLoadingProps {
  environment: AuthEnvironment;
  liffService: LiffService;
  authRequiredPaths?: string[];
}

/**
 * 認証状態の予測ロード機能を提供するフック
 * 認証が必要なパスへの遷移を予測し、事前に認証状態を準備
 */
export const useAuthPredictiveLoading = ({ 
  environment, 
  liffService, 
  authRequiredPaths = [] 
}: UseAuthPredictiveLoadingProps) => {
  const pathname = usePathname();
  const predictiveLoadingRef = useRef(false);

  useEffect(() => {
    // LIFF環境でない、または既に予測ロード済みの場合はスキップ
    if (environment !== AuthEnvironment.LIFF || 
        predictiveLoadingRef.current || 
        authRequiredPaths.length === 0) {
      return;
    }

    // 現在のパスが認証不要の場合のみ予測ロードを実行
    if (!isAuthRequiredForPath(pathname)) {
      const performPredictiveLoading = () => {
        predictiveLoadingRef.current = true;
        
        // 認証が必要なパスが存在する場合、LIFFの初期化を予測的に実行
        const hasAuthRequiredPaths = authRequiredPaths.some(path => 
          isAuthRequiredForPath(path)
        );
        
        if (hasAuthRequiredPaths) {
          logger.debug("Starting predictive LIFF initialization", {
            currentPath: pathname,
            authRequiredPaths,
            component: "useAuthPredictiveLoading",
          });
          
          // バックグラウンドでLIFF初期化を実行（結果は使用しない）
          liffService.initialize().catch(error => {
            // 予測ロードの失敗は無視（通常の動作に影響しない）
            logger.debug("Predictive LIFF initialization failed (non-critical)", {
              error: error instanceof Error ? error.message : String(error),
              component: "useAuthPredictiveLoading",
            });
          });
        }
      };

      // アイドル時間を利用して予測ロード
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => performPredictiveLoading());
      } else {
        setTimeout(performPredictiveLoading, 1000);
      }
    }
  }, [environment, liffService, pathname, authRequiredPaths]);
};
