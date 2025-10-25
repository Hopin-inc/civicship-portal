"use client";

import React, { useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { PortfolioTab } from "../../types";

interface PortfolioTabsProps {
  activeTab: PortfolioTab;
  setActiveTab: React.Dispatch<React.SetStateAction<PortfolioTab>>;
}

export function PortfolioTabs({ activeTab, setActiveTab }: PortfolioTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === PortfolioTab.Future || tabParam === PortfolioTab.Past) {
      setActiveTab(tabParam);
    }
  }, [searchParams, setActiveTab]);

  const handleTabChange = (value: string) => {
    const newTab = value as PortfolioTab;
    setActiveTab(newTab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger
          value={PortfolioTab.Future}
          className={clsx(
            "px-6 py-2 font-bold text-base",
            activeTab === PortfolioTab.Future
              ? "border-blue-600 border-b-[2px]"
              : "bg-white text-black border-b-[1px]",
          )}
        >
          今後の予定
        </TabsTrigger>
        <TabsTrigger
          value={PortfolioTab.Past}
          className={clsx(
            "px-6 py-2 font-bold text-base",
            activeTab === PortfolioTab.Past
              ? "border-blue-600 border-b-[2px]"
              : "bg-white text-black border-b-[1px]",
          )}
        >
          過去
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
