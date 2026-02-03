"use client";

import { OpportunityList } from "./features/list/components/OpportunityList";
import { useMemo } from "react";
import { useAppRouter } from "@/lib/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { GqlPublishStatus } from "@/types/graphql";
import { Plus } from "lucide-react";

export default function OpportunitiesPage() {
  const router = useAppRouter();

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
      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="flex space-x-2">
            <TabsTrigger value="all">すべて</TabsTrigger>
            <TabsTrigger value="published">公開済み</TabsTrigger>
            <TabsTrigger value="draft">下書き</TabsTrigger>
          </TabsList>

          <Button
            onClick={() => router.push("/admin/opportunities/new")}
            variant="primary"
            size="sm"
            className="gap-1" // ← アイコンとラベルの距離を詰める
          >
            <Plus className="h-4 w-4" /> {/* ← アイコンを縮小 */}
            作成
          </Button>
        </div>

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
