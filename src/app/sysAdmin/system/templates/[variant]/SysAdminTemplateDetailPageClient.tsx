"use client";

import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GqlReportTemplateKind,
  type GqlGetAdminTemplateFeedbackStatsQuery,
  type GqlGetAdminTemplateFeedbacksQuery,
  type GqlReportTemplateFieldsFragment,
  type GqlReportTemplateStatsBreakdownRowFieldsFragment,
  type GqlReportVariant,
} from "@/types/graphql";
import {
  kindLabel,
  variantLabel,
} from "@/app/sysAdmin/features/system/templates/shared/labels";
import { GenerationTemplateContainer } from "@/app/sysAdmin/features/system/templates/editor/components/GenerationTemplateContainer";
import { JudgeTemplateContainer } from "@/app/sysAdmin/features/system/templates/editor/components/JudgeTemplateContainer";

type FeedbacksConnection = NonNullable<
  GqlGetAdminTemplateFeedbacksQuery["adminTemplateFeedbacks"]
>;
type FeedbackStats =
  GqlGetAdminTemplateFeedbackStatsQuery["adminTemplateFeedbackStats"];

type Props = {
  variant: GqlReportVariant;
  generationBreakdownRows: GqlReportTemplateStatsBreakdownRowFieldsFragment[];
  generationTemplate: GqlReportTemplateFieldsFragment | null;
  generationFeedbacks: FeedbacksConnection | null;
  generationStats: FeedbackStats | null;
  judgeBreakdownRows: GqlReportTemplateStatsBreakdownRowFieldsFragment[];
  judgeTemplate: GqlReportTemplateFieldsFragment | null;
  judgeFeedbacks: FeedbacksConnection | null;
  judgeStats: FeedbackStats | null;
};

/**
 * tabs UI + header config を持つ client wrapper。
 * data 取得は page.tsx (RSC) 側で行い、初期 data として props で受ける。
 */
export function SysAdminTemplateDetailPageClient({
  variant,
  generationBreakdownRows,
  generationTemplate,
  generationFeedbacks,
  generationStats,
  judgeBreakdownRows,
  judgeTemplate,
  judgeFeedbacks,
  judgeStats,
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
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="generation">
            {kindLabel(GqlReportTemplateKind.Generation)}
          </TabsTrigger>
          <TabsTrigger value="judge">
            {kindLabel(GqlReportTemplateKind.Judge)}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="generation">
          <GenerationTemplateContainer
            variant={variant}
            initialBreakdownRows={generationBreakdownRows}
            initialTemplate={generationTemplate}
            initialFeedbacks={generationFeedbacks}
            initialStats={generationStats}
          />
        </TabsContent>
        <TabsContent value="judge">
          <JudgeTemplateContainer
            variant={variant}
            initialBreakdownRows={judgeBreakdownRows}
            initialJudgeTemplate={judgeTemplate}
            initialFeedbacks={judgeFeedbacks}
            initialStats={judgeStats}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
