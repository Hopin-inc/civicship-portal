/*
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
        if (isSearchTabType(v)) {
          onTabChange(v);
        }
      }}
      className="mb-6"
    >
      <TabsList>
        <TabsTrigger value="activity">
          体験
        </TabsTrigger>
        <TabsTrigger value="quest">
          お手伝い
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default SearchTabs;
*/
