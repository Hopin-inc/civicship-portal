"use client";

import { useMemo } from "react";
import { useAppRouter } from "@/lib/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateRow } from "@/app/sysAdmin/features/system/templates/list/components/TemplateRow";
import { variantToSlug } from "@/app/sysAdmin/features/system/templates/shared/variantSlug";
import type { VariantSummary } from "@/app/sysAdmin/features/system/templates/shared/aggregate";

type Props = {
  generationSummaries: VariantSummary[];
  judgeSummaries: VariantSummary[];
};

export function SysAdminSystemTemplatesPageClient({
  generationSummaries,
  judgeSummaries,
}: Props) {
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
          <KindList summaries={generationSummaries} />
        </TabsContent>
        <TabsContent value="judge">
          <KindList summaries={judgeSummaries} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function KindList({ summaries }: { summaries: VariantSummary[] }) {
  const router = useAppRouter();

  if (summaries.every((s) => s.activeTemplateCount === 0)) {
    return (
      <p className="text-body-sm text-muted-foreground py-8 text-center">
        登録されているテンプレートはありません
      </p>
    );
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
