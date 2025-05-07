'use client';

import React from 'react';

interface LoadingIndicatorProps {
  message?: string;
  className?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = 'Loading...', 
  className = '' 
}) => {
  return (
    <div className={`container mx-auto p-4 flex justify-center items-center flex-col ${className}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mb-2"></div>
      {message && <p className="text-muted-foreground">{message}</p>}
    </div>
  );
};

export default LoadingIndicator;
