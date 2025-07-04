"use client";

import React, { useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs as TabsEnum } from "../types/tabs";
import { useRouter, useSearchParams } from "next/navigation";

interface TabManagerProps {
  activeTab: TabsEnum;
  setActiveTab: React.Dispatch<React.SetStateAction<TabsEnum>>;
}

export function TabManager({ activeTab, setActiveTab }: TabManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URLパラメータからタブを初期化
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "history" || tabParam === "member") {
      setActiveTab(tabParam as TabsEnum);
    }
  }, [searchParams, setActiveTab]);

  // タブ切り替え時にURLを更新
  const handleTabChange = (value: string) => {
    const newTab = value as TabsEnum;
    setActiveTab(newTab);
    
    // 現在のURLパラメータを取得
    const params = new URLSearchParams(searchParams.toString());
    
    // タブパラメータを更新
    params.set("tab", newTab);
    
    // URLを更新（履歴を残す）
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="gap-2 w-3/5 pl-4">
        <TabsTrigger
          value={TabsEnum.History}
          className={`
            rounded-full px-6 py-2 font-bold text-sm
            ${activeTab === TabsEnum.History
              ? "!bg-blue-600 !text-white border border-blue-600"
              : "bg-white text-black border border-gray-300"
            }
          `}
        >
          履歴
        </TabsTrigger>
        <TabsTrigger
          value={TabsEnum.Member}
          className={`
            rounded-full px-6 py-2 font-bold text-sm
            ${activeTab === TabsEnum.Member
              ? "!bg-blue-600 !text-white border border-blue-600 shadow"
              : "bg-white text-black border border-gray-300"
            }
          `}
        >
          メンバー
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
} 