"use client";

import React, { useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs as TabsEnum } from "../types/tabs";
import { useSearchParams, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { useTranslations } from "next-intl";

interface TabManagerProps {
  activeTab: TabsEnum;
  setActiveTab: React.Dispatch<React.SetStateAction<TabsEnum>>;
}

export function TabManager({ activeTab, setActiveTab }: TabManagerProps) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "history" || tabParam === "member") {
      setActiveTab(tabParam as TabsEnum);
    }
  }, [searchParams, setActiveTab]);

  const handleTabChange = (value: string) => {
    const newTab = value as TabsEnum;
    setActiveTab(newTab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);
    // Use native router with full pathname to avoid path resolution issues
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="gap-2 w-3/5 pl-4 bg-transparent p-0">
        <TabsTrigger
          value={TabsEnum.History}
          className={clsx(
            "rounded-full px-6 py-2 font-bold text-sm",
            activeTab === TabsEnum.History
              ? "!bg-blue-600 !text-white border border-blue-600"
              : "bg-white text-black border border-gray-300",
          )}
        >
          {t("wallets.shared.tabs.history")}
        </TabsTrigger>
        <TabsTrigger
          value={TabsEnum.Member}
          className={clsx(
            "rounded-full px-6 py-2 font-bold text-sm",
            activeTab === TabsEnum.Member
              ? "!bg-blue-600 !text-white border border-blue-600 shadow"
              : "bg-white text-black border border-gray-300",
          )}
        >
          {t("wallets.shared.tabs.member")}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
