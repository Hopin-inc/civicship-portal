"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { isAuthRequiredForPath } from "@/config/auth-config";

/**
 * 認証パスチェックを効率化するためのカスタムフック
 * パス変更時にのみ再計算し、メモ化された結果を返す
 */
export const useAuthPathCheck = (authRequiredPaths?: string[]) => {
  const pathname = usePathname();

  const isAuthRequired = useMemo(() => {
    // 特定のページでのみ認証を実行する場合の条件チェック
    if (authRequiredPaths && authRequiredPaths.length > 0) {
      return isAuthRequiredForPath(pathname);
    }
    
    // authRequiredPathsが空の場合は常にtrue（全ページで認証実行）
    return true;
  }, [pathname, authRequiredPaths]);

  return {
    isAuthRequired,
    pathname,
  };
};
