

import React from 'react';
import { Button } from '@/components/ui/button';

interface SearchFooterProps {
  onClear: () => void;
  onSearch: () => void;
}

/**
 * Footer component with clear and search buttons
 */
export const SearchFooter: React.FC<SearchFooterProps> = ({ 
  onClear, 
  onSearch 
}) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t z-10">
      <div className="max-w-lg mx-auto px-4 h-16 flex justify-between items-center">
        <button 
          onClick={onClear}
          className="text-gray-500 text-sm"
        >
          条件をクリア
        </button>
        <Button 
          onClick={onSearch}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium"
        >
          検索
        </Button>
      </div>
    </footer>
  );
};

export default SearchFooter;
