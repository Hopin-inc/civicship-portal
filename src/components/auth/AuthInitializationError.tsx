"use client";

import React from "react";
import { AuthInitializationContext } from "@/types/auth";

interface AuthInitializationErrorProps {
  initializationContext: AuthInitializationContext;
  onRetry: () => void;
}

const AuthInitializationError: React.FC<AuthInitializationErrorProps> = ({ 
  initializationContext, 
  onRetry 
}) => {
  const canRetry = initializationContext.retryCount < 3;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-mobile-l px-4 space-y-6 text-center">
        <div className="space-y-2">
          <h2 className="text-heading-md text-foreground">
            認証の初期化に失敗しました
          </h2>
          <p className="text-body-md text-muted-foreground">
            {initializationContext.error || "不明なエラーが発生しました"}
          </p>
        </div>
        
        {canRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            再試行 ({3 - initializationContext.retryCount}回まで)
          </button>
        )}
        
        {!canRetry && (
          <div className="space-y-4">
            <p className="text-body-sm text-muted-foreground">
              再試行回数の上限に達しました。ページを再読み込みしてください。
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
            >
              ページを再読み込み
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthInitializationError;
