'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  title?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  message, 
  title = 'エラーが発生しました' 
}) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col items-center text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-red-700 mb-2">{title}</h2>
        <p className="text-red-600">{message}</p>
      </div>
    </div>
  );
};

export default ErrorState;
