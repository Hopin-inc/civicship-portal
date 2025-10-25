"use client";

import React, { useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { TabsEnum } from "../types";

interface TabManagerProps {
  activeTab: TabsEnum;
  setActiveTab: React.Dispatch<React.SetStateAction<TabsEnum>>;
}

export function TabManager({ activeTab, setActiveTab }: TabManagerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === TabsEnum.Future || tabParam === TabsEnum.Past) {
      setActiveTab(tabParam);
    }
  }, [searchParams, setActiveTab]);

  const handleTabChange = (value: string) => {
    const newTab = value as TabsEnum;
    setActiveTab(newTab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger
          value={TabsEnum.Future}
          className={clsx(
            "px-6 py-2 font-bold text-base",
            activeTab === TabsEnum.Future
              ? "border-blue-600 border-b-[2px]"
              : "bg-white text-black border-b-[1px]"
          )}
        >
          今後の予定
        </TabsTrigger>
        <TabsTrigger
          value={TabsEnum.Past}
          className={clsx(
            "px-6 py-2 font-bold text-base",
            activeTab === TabsEnum.Past
              ? "border-blue-600 border-b-[2px]"
              : "bg-white text-black border-b-[1px]"
          )}
        >
          過去
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
} 