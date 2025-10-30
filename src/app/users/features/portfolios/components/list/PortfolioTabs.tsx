"use client";

import React, { useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { PortfolioTab } from "../../types";
import { useTranslations } from "next-intl";

interface PortfolioTabsProps {
  activeTab: PortfolioTab;
  setActiveTab: React.Dispatch<React.SetStateAction<PortfolioTab>>;
}

function isPortfolioTab(value: string | null): value is PortfolioTab {
  return value === PortfolioTab.Future || value === PortfolioTab.Past;
}

export function PortfolioTabs({ activeTab, setActiveTab }: PortfolioTabsProps) {
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (isPortfolioTab(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams, setActiveTab]);

  const handleTabChange = (value: string) => {
    if (isPortfolioTab(value)) {
      setActiveTab(value);
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", value);
      router.push(`?${params.toString()}`, { scroll: false });
    }
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
          {t("users.portfolio.tabs.future")}
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
          {t("users.portfolio.tabs.past")}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
