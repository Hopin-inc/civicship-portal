"use client";

import React from "react";
import { AuthInitializationContext } from "@/types/auth";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

interface AuthInitializationScreenProps {
  initializationContext: AuthInitializationContext;
}

const AuthInitializationScreen: React.FC<AuthInitializationScreenProps> = ({ 
  initializationContext 
}) => {
  const getStageMessage = (state: AuthInitializationContext["state"]): string => {
    switch (state) {
      case "not_started":
        return "認証システムを準備中...";
      case "checking_tokens":
        return "認証情報を確認中...";
      case "checking_user":
        return "ユーザー情報を取得中...";
      case "hydrating":
        return "画面を準備中...";
      default:
        return "読み込み中...";
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-mobile-l px-4 space-y-6">
        <LoadingIndicator />
        
        <div className="text-center space-y-2">
          <p className="text-body-md text-foreground">
            {getStageMessage(initializationContext.state)}
          </p>
          
          {initializationContext.progress > 0 && (
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${initializationContext.progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthInitializationScreen;
