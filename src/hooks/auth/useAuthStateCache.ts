"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { isAuthRequiredForPath } from "@/config/auth-config";

interface UseAuthStateCacheProps {
  authRequiredPaths?: string[];
}

/**
 * 認証状態をキャッシュして高速化するフック
 * 認証が必要なページへの遷移を予測し、事前に状態を準備
 */
export const useAuthStateCache = ({ authRequiredPaths = [] }: UseAuthStateCacheProps) => {
  const pathname = usePathname();
  const cacheRef = useRef<Map<string, boolean>>(new Map());

  useEffect(() => {
    // 現在のパスが認証不要の場合、関連する認証必要パスの状態をキャッシュ
    if (authRequiredPaths.length > 0 && !isAuthRequiredForPath(pathname)) {
      const cacheAuthStates = async () => {
        // 認証が必要なパスの状態を事前にチェック
        for (const authPath of authRequiredPaths) {
          if (!cacheRef.current.has(authPath)) {
            // 実際の認証チェックは行わず、パス情報のみキャッシュ
            cacheRef.current.set(authPath, true);
          }
        }
      };

      // アイドル時間を利用してキャッシュ
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => cacheAuthStates());
      } else {
        setTimeout(cacheAuthStates, 500);
      }
    }
  }, [pathname, authRequiredPaths]);

  return {
    getCachedAuthState: (path: string) => cacheRef.current.get(path),
    clearCache: () => cacheRef.current.clear(),
  };
};
