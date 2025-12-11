"use client";

import { OpportunityList } from "./components/OpportunityList";
import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GqlPublishStatus } from "@/types/graphql";

export default function OpportunitiesPage() {
  const headerConfig = useMemo(
    () => ({
      title: "募集一覧",
      showLogo: false,
      showBackButton: true,
      backTo: "/admin",
    }),
    []
  );
  useHeaderConfig(headerConfig);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        {/* 新規作成ボタン（Phase 2で実装予定） */}
        {/*<CreateOpportunitySheet />*/}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">すべて</TabsTrigger>
          <TabsTrigger value="published">公開済み</TabsTrigger>
          <TabsTrigger value="draft">下書き</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <OpportunityList key="all" status="all" />
        </TabsContent>

        <TabsContent value="published" className="mt-4">
          <OpportunityList key="published" status={GqlPublishStatus.Public} />
        </TabsContent>

        <TabsContent value="draft" className="mt-4">
          <OpportunityList key="draft" status={GqlPublishStatus.Private} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
