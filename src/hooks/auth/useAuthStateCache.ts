"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { isAuthRequiredForPath } from "@/config/auth-config";

interface UseAuthStateCacheProps {
  authRequiredPaths?: string[];
}

/**
 * 認証パスチェックのグローバルキャッシュをウォームアップするフック
 * 認証が必要なパスへの遷移を予測し、事前にキャッシュを準備
 */
export const useAuthStateCache = ({ authRequiredPaths = [] }: UseAuthStateCacheProps) => {
  const pathname = usePathname();
  const warmedUpRef = useRef(false);

  useEffect(() => {
    // 現在のパスが認証不要で、まだウォームアップしていない場合
    if (authRequiredPaths.length > 0 && 
        !isAuthRequiredForPath(pathname) && 
        !warmedUpRef.current) {
      
      const warmupCache = () => {
        warmedUpRef.current = true;
        
        // 認証が必要なパスのキャッシュをウォームアップ
        for (const authPath of authRequiredPaths) {
          // isAuthRequiredForPathを呼び出してグローバルキャッシュに結果を格納
          isAuthRequiredForPath(authPath);
        }
      };

      // アイドル時間を利用してウォームアップ
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => warmupCache());
      } else {
        setTimeout(warmupCache, 500);
      }
    }
  }, [pathname, authRequiredPaths]);
};
