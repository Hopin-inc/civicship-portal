"use client";

import React, { useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
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
    <div className={"px-4"}>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value={PortfolioTab.Future} className="flex-1">
            {t("users.portfolio.tabs.future")}
          </TabsTrigger>
          <TabsTrigger value={PortfolioTab.Past} className="flex-1">
            {t("users.portfolio.tabs.past")}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
