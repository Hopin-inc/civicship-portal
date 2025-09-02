"use client";

import React, { useEffect } from "react";
import { Check, Loader2 } from "lucide-react";
import { getLogoPath } from "@/lib/communities/metadata";
import { cn } from "@/lib/utils";
import { AuthenticationState } from "@/lib/auth/auth-state-manager";

interface LoadingIndicatorProps {
  fullScreen?: boolean;
  authenticationState?: AuthenticationState;
  isLiffInitialized?: boolean;
}

interface ProgressStep {
  id: string;
  label: string;
  isCompleted: boolean;
  isActive: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  fullScreen = true,
  authenticationState,
  isLiffInitialized
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const showDetailedProgress = authenticationState !== undefined || isLiffInitialized !== undefined;

  if (!showDetailedProgress) {
    const SimpleSpinner = (
      <div className="flex justify-center items-center">
        <div className="animate-spin h-8 w-8 bg-blue-300 rounded-xl"></div>
      </div>
    );

    if (fullScreen) {
      return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background bg-opacity-80">
          {SimpleSpinner}
        </div>
      );
    }

    return <div>{SimpleSpinner}</div>;
  }

  const getProgressSteps = (): ProgressStep[] => {
    return [
      {
        id: "user-auth",
        label: "ユーザー認証中...",
        isCompleted: authenticationState ? ["line_authenticated", "phone_authenticated", "user_registered"].includes(authenticationState) : false,
        isActive: (authenticationState === "loading" || authenticationState === undefined)
      },
      {
        id: "user-info",
        label: "ユーザー情報取得中...",
        isCompleted: authenticationState === "user_registered",
        isActive: authenticationState === "line_authenticated" || authenticationState === "phone_authenticated"
      }
    ];
  };

  const progressSteps = getProgressSteps();
  const logoPath = getLogoPath();

  const ProgressStepItem: React.FC<{ step: ProgressStep }> = ({ step }) => (
    <div className="flex items-center space-x-3 py-2">
      <div className={cn(
        "w-6 h-6 rounded-full flex items-center justify-center border-2",
        step.isCompleted 
          ? "bg-green-500 border-green-500 text-white" 
          : step.isActive 
            ? "border-blue-500 text-blue-500" 
            : "border-gray-300 text-gray-300"
      )}>
        {step.isCompleted ? (
          <Check className="w-4 h-4" />
        ) : step.isActive ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-current" />
        )}
      </div>
      <span className={cn(
        "text-sm",
        step.isCompleted 
          ? "text-green-600 font-medium" 
          : step.isActive 
            ? "text-blue-600 font-medium" 
            : "text-gray-500"
      )}>
        {step.label}
      </span>
    </div>
  );

  const LoadingContent = (
    <div className="flex flex-col items-center justify-center space-y-8 p-8">
      <div className="w-20 h-20 relative">
        <img 
          src={logoPath} 
          alt="ロゴ" 
          className="w-full h-full object-contain"
        />
      </div>

      <div className="flex items-center space-x-3">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        <span className="text-lg font-medium text-gray-700">認証中...</span>
      </div>

      <div className="w-full max-w-sm space-y-1">
        {progressSteps.map((step) => (
          <ProgressStepItem key={step.id} step={step} />
        ))}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-95 backdrop-blur-sm">
        {LoadingContent}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-4">{LoadingContent}</div>;
};

export default LoadingIndicator;
