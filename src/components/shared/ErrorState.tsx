'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message?: string;
  title?: string;
  actionText?: string;
  actionHref?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = 'エラーが発生しました',
  title = 'エラーが発生しました',
  actionText,
  actionHref
}) => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col items-center text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-red-700 mb-2">{title}</h2>
        <p className="text-red-600">{message}</p>
        {actionText && actionHref && (
          <Link href={actionHref}>
            <Button 
              variant="destructive"
              className="mt-4"
            >
              {actionText}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ErrorState;
