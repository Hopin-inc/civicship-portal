"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionsTab } from "./TransactionsTab";
import { MembersTab } from "./MembersTab";
import { GqlTransactionsConnection } from "@/types/graphql";
import { useTranslations } from "next-intl";
import useHeaderConfig from "@/hooks/useHeaderConfig";

export type CommunityTabType = "transactions" | "members";

interface CommunityTabsProps {
  initialTransactions: GqlTransactionsConnection;
}

export function CommunityTabs({ initialTransactions }: CommunityTabsProps) {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<CommunityTabType>("transactions");

  const headerConfig = useMemo(
    () => ({
      title: "ホーム",
      showBackButton: false,
      showLogo: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as CommunityTabType)}
      className="w-full"
    >
      <TabsList className="w-full">
        <TabsTrigger value="transactions" className="flex-1">
          {t("community.tabs.transactions")}
        </TabsTrigger>
        <TabsTrigger value="members" className="flex-1">
          {t("community.tabs.members")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="transactions">
        <TransactionsTab initialTransactions={initialTransactions} />
      </TabsContent>

      <TabsContent value="members">
        <MembersTab />
      </TabsContent>
    </Tabs>
  );
}
