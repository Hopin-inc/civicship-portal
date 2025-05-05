'use client';

import React from 'react';
import { SearchTabType } from '@/hooks/features/search/useSearch';

interface SearchTabsProps {
  selectedTab: SearchTabType;
  onTabChange: (tab: SearchTabType) => void;
}

/**
 * Tab selection component for switching between activity and quest search
 */
export const SearchTabs: React.FC<SearchTabsProps> = ({ 
  selectedTab, 
  onTabChange 
}) => {
  return (
    <div className="mb-6">
      <div className="flex">
        <button
          onClick={() => onTabChange('activity')}
          className={`flex-1 pb-3 text-center text-xl relative ${
            selectedTab === 'activity'
              ? 'text-blue-600 font-medium'
              : 'text-gray-400'
          }`}
        >
          体験
          {selectedTab === 'activity' && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600" />
          )}
        </button>
        <button
          onClick={() => onTabChange('quest')}
          className={`flex-1 pb-3 text-center text-xl relative ${
            selectedTab === 'quest'
              ? 'text-blue-600 font-medium'
              : 'text-gray-400'
          }`}
        >
          お手伝い
          {selectedTab === 'quest' && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600" />
          )}
        </button>
      </div>
    </div>
  );
};

export default SearchTabs;
