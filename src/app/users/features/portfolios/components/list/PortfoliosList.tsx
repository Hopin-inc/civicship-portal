"use client";
import { TabManager } from "./TabManager";
import { TabsEnum } from "../../types";
import { useState } from "react";
import SearchForm from "@/components/shared/SearchForm";
import { FutureTab } from "./FutureTab";
import { PastTab } from "./PastTab";

export function PortfoliosList() {
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
