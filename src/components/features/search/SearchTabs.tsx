
import React from 'react';
import { SearchTabType } from '@/hooks/features/search/useSearch';
import { Button } from '@/components/ui/button';

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
        <Button
          onClick={() => onTabChange('activity')}
          variant="link"
          className={`flex-1 pb-3 text-center text-xl relative ${
            selectedTab === 'activity'
              ? 'text-primary font-medium'
              : 'text-muted-foreground'
          }`}
        >
          体験
          {selectedTab === 'activity' && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600" />
          )}
        </Button>
        <Button
          onClick={() => onTabChange('quest')}
          variant="link"
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
        </Button>
      </div>
    </div>
  );
};

export default SearchTabs;
