"use client";
import { TabManager } from "./TabManager";
import { TabsEnum } from "../types";
import { useState } from "react";
import SearchForm from "@/components/shared/SearchForm";
import FutureTab from "./FutureTab";
import PastTab from "./PastTab";
import { useAuth } from "@/contexts/AuthProvider";

export function groupByDate<T extends { date: string }>(items: T[]): Record<string, T[]> {
  if (!items) return {};
  return items.reduce((acc, item) => {
    const date = item.date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

export default function PortfoliosList() {
    const [activeTab, setActiveTab] = useState<TabsEnum>(TabsEnum.Future);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [input, setInput] = useState<string>("");
    const { user: currentUser } = useAuth();

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
            {activeTab === TabsEnum.Future && <FutureTab searchQuery={searchQuery} currentUser={currentUser} />}
            {activeTab === TabsEnum.Past && <PastTab searchQuery={searchQuery} currentUser={currentUser} />}
        </div>
    );
}