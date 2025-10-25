"use client";
import { TabManager } from "./tab/TabManager";
import { TabsEnum } from "../types";
import { useState } from "react";
import SearchForm from "@/components/shared/SearchForm";
import FutureTab from "./tab/FutureTab";
import PastTab from "./tab/PastTab";

export function groupByDate<T extends { dateISO: string }>(items: T[]): Record<string, T[]> {
  if (!items) return {};
  return items.reduce(
    (acc, item) => {
      const date = item.dateISO;
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}

export default function PortfoliosList() {
  const [activeTab, setActiveTab] = useState<TabsEnum>(TabsEnum.Future);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [input, setInput] = useState<string>("");

  return (
    <div className="py-6 px-6">
      <TabManager activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mt-4">
        <SearchForm
          value={input}
          onInputChange={setInput}
          onSearch={setSearchQuery}
          placeholder="キーワードで検索"
        />
      </div>
      {activeTab === TabsEnum.Future && <FutureTab searchQuery={searchQuery} />}
      {activeTab === TabsEnum.Past && <PastTab searchQuery={searchQuery} />}
    </div>
  );
}
