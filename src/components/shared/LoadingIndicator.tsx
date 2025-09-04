"use client";

import React, { useEffect } from "react";
import { AuthenticationState } from "@/lib/auth/auth-state-manager";

interface LoadingIndicatorProps {
  fullScreen?: boolean;
  authenticationState?: AuthenticationState;
  isLiffInitialized?: boolean;
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

  const getProgressPercentage = (): number => {
    if (!authenticationState) return 0;
    
    switch (authenticationState) {
      case "loading":
        return 20;
      case "line_authenticated":
      case "phone_authenticated":
        return 80;
      case "user_registered":
        return 100;
      default:
        return 0;
    }
  };

  const progressPercentage = getProgressPercentage();

  const ProgressBar: React.FC<{ percentage: number }> = ({ percentage }) => (
    <div className="w-full max-w-md">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-300 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between items-center mb-2 mt-4">
        <span className="text-sm font-medium text-gray-700">ログイン処理中</span>
        <span className="text-sm font-medium text-gray-700">{percentage}%</span>
      </div>
    </div>
  );

  const LoadingContent = (
    <div className="flex flex-col items-center justify-center space-y-8 p-8 w-full max-w-lg">
      <div className="flex justify-center items-center">
        <div className="animate-spin h-8 w-8 bg-blue-300 rounded-xl"></div>
      </div>
      <ProgressBar percentage={progressPercentage} />
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
