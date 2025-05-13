import React from "react";
import { SearchTabType } from "@/app/search/hooks/useSearch";
import { Button } from "@/components/ui/button";

interface SearchTabsProps {
  selectedTab: SearchTabType;
  onTabChange: (tab: SearchTabType) => void;
}

/**
 * Tab selection component for switching between activity and quest search
 */
export const SearchTabs: React.FC<SearchTabsProps> = ({ selectedTab, onTabChange }) => {
  return (
    <div className="mb-6">
      <div className="flex">
        <Button
          onClick={() => onTabChange("activity")}
          variant="link"
          className={`flex-1 pb-3 text-center text-xl relative ${
            selectedTab === "activity" ? "text-primary font-medium" : "text-muted-foreground"
          }`}
        >
          体験
          {selectedTab === "activity" && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary" />
          )}
        </Button>
        <Button
          onClick={() => onTabChange("quest")}
          variant="link"
          className={`flex-1 pb-3 text-center text-xl relative ${
            selectedTab === "quest" ? "text-primary font-medium" : "text-muted-foreground"
          }`}
        >
          お手伝い
          {selectedTab === "quest" && (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default SearchTabs;
