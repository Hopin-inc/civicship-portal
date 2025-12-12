"use client";

import { OpportunityList } from "./components/OpportunityList";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { GqlPublishStatus } from "@/types/graphql";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function OpportunitiesPage() {
  const router = useRouter();

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
        <h1 className="text-2xl font-bold">募集管理</h1>
        <Button
          onClick={() => router.push("/admin/opportunities/new")}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          新規作成
        </Button>
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
