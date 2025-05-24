"use client";

import React, { useEffect } from "react";

interface LoadingIndicatorProps {
  fullScreen?: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ fullScreen = true }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

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

  return <div>{Spinner}</div>;
};

export default LoadingIndicator;
