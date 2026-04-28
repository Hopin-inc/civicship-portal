"use client";

import { useMemo } from "react";
import { useAppRouter } from "@/lib/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GqlReportTemplateKind } from "@/types/graphql";
import { TemplateRow } from "@/app/sysAdmin/features/system/templates/list/components/TemplateRow";
import { useVariantSummaries } from "@/app/sysAdmin/features/system/templates/list/hooks/useVariantSummaries";
import { variantToSlug } from "@/app/sysAdmin/features/system/templates/shared/variantSlug";
import type { VariantSummary } from "@/app/sysAdmin/features/system/templates/shared/aggregate";

export default function SysAdminSystemTemplatesPage() {
  const headerConfig = useMemo(
    () => ({
      title: "テンプレート",
      showBackButton: true,
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  return (
    <div className="p-4 max-w-xl mx-auto">
      <Tabs defaultValue="generation" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="generation">生成用</TabsTrigger>
          <TabsTrigger value="judge">評価用</TabsTrigger>
        </TabsList>
        <TabsContent value="generation">
          <KindList kind={GqlReportTemplateKind.Generation} />
        </TabsContent>
        <TabsContent value="judge">
          <KindList kind={GqlReportTemplateKind.Judge} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function KindList({ kind }: { kind: GqlReportTemplateKind }) {
  const router = useAppRouter();
  const { summaries, loading, error } = useVariantSummaries(kind);

  const isEmpty = summaries.every((s: VariantSummary) => s.activeTemplateCount === 0);

  if (loading && isEmpty) {
    return <LoadingIndicator fullScreen={false} />;
  }

  if (error) {
    return <ErrorState title="テンプレート一覧の取得に失敗しました" />;
  }

  return (
    <div className="flex flex-col">
      {summaries.map((summary, idx) => {
        const slug = variantToSlug(summary.variant);
        return (
          <div key={summary.variant}>
            {idx !== 0 && <hr className="border-muted" />}
            <TemplateRow
              summary={summary}
              onClick={
                slug
                  ? () => router.push(`/sysAdmin/system/templates/${slug}`)
                  : undefined
              }
            />
          </div>
        );
      })}
    </div>
  );
}
