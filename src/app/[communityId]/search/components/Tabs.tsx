"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type SearchTabType = "activity" | "quest";

export interface SearchTabsProps {
  selectedTab: SearchTabType;
  onTabChange: (tab: SearchTabType) => void;
}

const isSearchTabType = (value: string): value is SearchTabType => {
  return value === "activity" || value === "quest";
};

const SearchTabs: React.FC<SearchTabsProps> = ({ selectedTab, onTabChange }) => {
  return (
    <Tabs
      value={selectedTab}
      onValueChange={(v) => {
        if (isSearchTabType(v)) onTabChange(v);
      }}
      className="mb-2 w-full"
    >
      <TabsList className="w-full">
        <TabsTrigger value="activity" className="flex-1">
          体験
        </TabsTrigger>
        <TabsTrigger value="quest" className="flex-1">
          お手伝い
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default SearchTabs;
