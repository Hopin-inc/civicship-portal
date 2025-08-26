"use client";

import { useEffect, useState } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthEnvironment } from "@/lib/auth/environment-detector";
import { logger } from "@/lib/logging";

interface UseProgressiveAuthProps {
  environment: AuthEnvironment;
  liffService: LiffService;
  isAuthRequired: boolean;
}

/**
 * 段階的な認証戦略を実装するフック
 * 認証が必要なページでも即座にコンテンツを表示し、バックグラウンドで認証を実行
 */
export const useProgressiveAuth = ({ 
  environment, 
  liffService, 
  isAuthRequired 
}: UseProgressiveAuthProps) => {
  const [authProgress, setAuthProgress] = useState<'idle' | 'initializing' | 'authenticating' | 'completed' | 'failed'>('idle');

  useEffect(() => {
    if (environment !== AuthEnvironment.LIFF || !isAuthRequired) {
      return;
    }

    const progressiveAuth = async () => {
      setAuthProgress('initializing');
      
      try {
        // 1. LIFF初期化（非ブロッキング）
        const initSuccess = await liffService.initialize();
        
        if (!initSuccess) {
          setAuthProgress('failed');
          return;
        }

        setAuthProgress('authenticating');

        // 2. 認証状態確認（非ブロッキング）
        const { isLoggedIn } = liffService.getState();
        
        if (isLoggedIn) {
          // 3. トークン認証（非ブロッキング）
          const authSuccess = await liffService.signInWithLiffToken();
          setAuthProgress(authSuccess ? 'completed' : 'failed');
        } else {
          setAuthProgress('completed'); // ログイン状態でない場合は正常
        }
      } catch (error) {
        logger.warn("Progressive auth failed", {
          error: error instanceof Error ? error.message : String(error),
          component: "useProgressiveAuth",
        });
        setAuthProgress('failed');
      }
    };

    // 即座に開始せず、少し遅延させてユーザー体験を向上
    const timeoutId = setTimeout(progressiveAuth, 100);
    
    return () => clearTimeout(timeoutId);
  }, [environment, liffService, isAuthRequired]);

  return {
    authProgress,
    isAuthenticating: authProgress === 'initializing' || authProgress === 'authenticating',
    isAuthCompleted: authProgress === 'completed',
    isAuthFailed: authProgress === 'failed',
  };
};
