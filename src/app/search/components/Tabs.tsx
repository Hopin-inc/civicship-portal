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

export const SearchTabs: React.FC<SearchTabsProps> = ({ selectedTab, onTabChange }) => {
  return (
    <Tabs
      value={selectedTab}
      onValueChange={(v) => {
        if (isSearchTabType(v)) {
          onTabChange(v);
        }
      }}
      className="mb-6"
    >
      <TabsList className="w-full grid grid-cols-2">
        <TabsTrigger value="activity" className="text-xl">
          体験
        </TabsTrigger>
        <TabsTrigger value="quest" className="text-xl">
          お手伝い
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default SearchTabs;
