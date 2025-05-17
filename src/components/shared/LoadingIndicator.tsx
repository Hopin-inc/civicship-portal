"use client";

import React from "react";

interface LoadingIndicatorProps {
  message?: string;
  className?: string;
  fullScreen?: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = "読み込み中",
  className = "",
  fullScreen = true,
}) => {
  const Spinner = (
    <div className="flex justify-center items-center">
      <div className="animate-spin h-8 w-8 bg-blue-300 rounded-xl"></div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-background bg-opacity-80">
        {Spinner}
      </div>
    );
  }

  return <div className={className}>{Spinner}</div>;
};

export default LoadingIndicator;
