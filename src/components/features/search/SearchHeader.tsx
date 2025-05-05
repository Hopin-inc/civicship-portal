'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Share, X } from 'lucide-react';

/**
 * Header component for the search page
 */
export const SearchHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b z-10">
      <div className="relative h-14 flex items-center justify-center px-4">
        <Link href="/public" className="absolute left-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-lg font-medium">体験・お手伝いを検索</h1>
        <div className="absolute right-4 flex items-center space-x-4">
          <button>
            <Share className="h-6 w-6" />
          </button>
          <Link href="/public">
            <X className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default SearchHeader;
