"use client";

import { OpportunityList } from "./components/OpportunityList";
import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function OpportunitiesPage() {
  const headerConfig = useMemo(
    () => ({
      title: "募集一覧",
      showLogo: false,
      showBackButton: true,
      backTo: "/admin",
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center">{/*<CreateOpportunitySheet />*/}</div>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">すべて</TabsTrigger>
          <TabsTrigger value="published">公開済み</TabsTrigger>
          <TabsTrigger value="draft">下書き</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <OpportunityList />
        </TabsContent>
        <TabsContent value="published">{/*<OpportunityList status="published" />*/}</TabsContent>
        <TabsContent value="draft">{/*<OpportunityList status="draft" />*/}</TabsContent>
      </Tabs>
    </div>
  );
}
