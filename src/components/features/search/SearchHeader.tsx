'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Share, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Header component for the search page
 */
export const SearchHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b max-w-mobile-l mx-auto w-full h-14 flex items-center px-4">
      <Link href="/public" className="absolute left-4">
        <ArrowLeft className="h-6 w-6" />
      </Link>
      <h1 className="flex-1 text-center text-lg font-medium truncate">体験・お手伝いを検索</h1>
      <div className="absolute right-4 flex items-center space-x-4">
        <Button variant="link">
          <Share className="h-6 w-6" />
        </Button>
        <Link href="/public">
          <X className="h-6 w-6" />
        </Link>
      </div>
    </header>
  );
};

export default SearchHeader;
