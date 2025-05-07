'use client';

import React from 'react';
import { SearchX } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface EmptySearchResultsProps {
  searchQuery?: string;
}

/**
 * Component to display when no search results are found
 */
export const EmptySearchResults: React.FC<EmptySearchResultsProps> = ({ 
  searchQuery 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-muted rounded-full p-4 mb-4">
        <SearchX className="h-10 w-10 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-bold mb-2">検索結果が見つかりませんでした</h2>
      <p className="text-gray-500 mb-6">
        {searchQuery 
          ? `「${searchQuery}」に一致する体験は見つかりませんでした。` 
          : '検索条件に一致する体験は見つかりませんでした。'}
      </p>
      <p className="text-gray-500 mb-8">
        別のキーワードや条件で再度検索してみてください。
      </p>
      <Link href="/search">
        <Button>
          検索条件を変更する
        </Button>
      </Link>
    </div>
  );
};

export default EmptySearchResults;
