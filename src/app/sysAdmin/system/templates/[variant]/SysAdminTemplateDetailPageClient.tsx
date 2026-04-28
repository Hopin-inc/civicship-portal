"use client";

import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  GqlReportTemplateFieldsFragment,
  GqlReportTemplateStatsBreakdownRowFieldsFragment,
  GqlReportVariant,
} from "@/types/graphql";
import { variantLabel } from "@/app/sysAdmin/features/system/templates/shared/labels";
import { GenerationTemplateContainer } from "@/app/sysAdmin/features/system/templates/editor/components/GenerationTemplateContainer";
import { JudgeTemplateContainer } from "@/app/sysAdmin/features/system/templates/editor/components/JudgeTemplateContainer";

type Props = {
  variant: GqlReportVariant;
  generationBreakdownRows: GqlReportTemplateStatsBreakdownRowFieldsFragment[];
  generationTemplate: GqlReportTemplateFieldsFragment | null;
  judgeBreakdownRows: GqlReportTemplateStatsBreakdownRowFieldsFragment[];
  judgeTemplate: GqlReportTemplateFieldsFragment | null;
};

/**
 * tabs UI + header config を持つ client wrapper。
 * data 取得は page.tsx (RSC) 側で行い、初期 data として props で受ける。
 */
export function SysAdminTemplateDetailPageClient({
  variant,
  generationBreakdownRows,
  generationTemplate,
  judgeBreakdownRows,
  judgeTemplate,
}: Props) {
  const headerConfig = useMemo(
    () => ({
      title: variantLabel(variant),
      showBackButton: true,
      showLogo: false,
    }),
    [variant],
  );
  useHeaderConfig(headerConfig);

  return (
    <div className="max-w-xl mx-auto mt-8 px-4">
      <Tabs defaultValue="generation" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="generation">生成用</TabsTrigger>
          <TabsTrigger value="judge">評価用</TabsTrigger>
        </TabsList>
        <TabsContent value="generation">
          <GenerationTemplateContainer
            variant={variant}
            initialBreakdownRows={generationBreakdownRows}
            initialTemplate={generationTemplate}
          />
        </TabsContent>
        <TabsContent value="judge">
          <JudgeTemplateContainer
            initialBreakdownRows={judgeBreakdownRows}
            initialJudgeTemplate={judgeTemplate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
