"use client";

import { useState } from "react";

export type SearchTabType = "activity" | "quest";

export function useSearchTabs() {
  const [selectedTab, setSelectedTab] = useState<SearchTabType>("activity");

  return {
    selectedTab,
    setSelectedTab,
  };
}
