"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useUpdateReportTemplateMutation,
  type GqlReportTemplateFieldsFragment,
  type GqlReportTemplateStatsBreakdownRowFieldsFragment,
  type GqlReportVariant,
} from "@/types/graphql";
import { makeMockFeedbacks } from "../../feedback/fixtures";
import { GenerationTemplateView } from "./GenerationTemplateView";

type Props = {
  variant: GqlReportVariant;
  initialBreakdownRows: GqlReportTemplateStatsBreakdownRowFieldsFragment[];
  initialTemplate: GqlReportTemplateFieldsFragment | null;
};

/**
 * `GenerationTemplateView` (presentational) と
 * mutation hook を結ぶ container。
 *
 * 初期 data は SSR で取得して props で受け取る。client-side fetch は
 * auth race の原因になるため使わない。保存後は `router.refresh()` で
 * SSR を再走させ、stats / template を最新化する。
 */
export function GenerationTemplateContainer({
  variant,
  initialBreakdownRows,
  initialTemplate,
}: Props) {
  const router = useRouter();
  const [systemPrompt, setSystemPrompt] = useState(
    initialTemplate?.systemPrompt ?? "",
  );
  const [userPromptTemplate, setUserPromptTemplate] = useState(
    initialTemplate?.userPromptTemplate ?? "",
  );

  const [save, { loading: saving, error: saveError }] =
    useUpdateReportTemplateMutation();

  const handleSave = useCallback(async () => {
    if (!initialTemplate) return;
    // ボタン onClick から呼ばれて promise が捨てられるため、ここで例外を握る。
    // mutation のエラーは Apollo の `saveError` 経由で UI に伝わる。
    try {
      await save({
        variables: {
          variant,
          input: {
            model: initialTemplate.model,
            maxTokens: initialTemplate.maxTokens,
            temperature: initialTemplate.temperature ?? undefined,
            stopSequences: initialTemplate.stopSequences,
            systemPrompt,
            userPromptTemplate,
            experimentKey: initialTemplate.experimentKey ?? undefined,
            isActive: initialTemplate.isActive,
            isEnabled: initialTemplate.isEnabled,
            trafficWeight: initialTemplate.trafficWeight,
            communityContext: initialTemplate.communityContext ?? undefined,
          },
        },
      });
      // SSR 経路の data を最新化する
      router.refresh();
    } catch {
      // saveError state でハンドル済み
    }
  }, [initialTemplate, save, variant, systemPrompt, userPromptTemplate, router]);

  const isDirty =
    initialTemplate != null &&
    (systemPrompt !== initialTemplate.systemPrompt ||
      userPromptTemplate !== initialTemplate.userPromptTemplate);

  // Phase 1.5 の `adminTemplateFeedbacks` query 待ち。それまで mock data を流す。
  // backend landing 後は SSR fetch に置換 (page.tsx 側で fetch して props 経由で渡す)。
  const mockFeedbacks = makeMockFeedbacks(8);

  return (
    <GenerationTemplateView
      rows={initialBreakdownRows}
      breakdownLoading={false}
      breakdownError={null}
      template={initialTemplate}
      editorLoading={false}
      editorError={null}
      systemPrompt={systemPrompt}
      userPromptTemplate={userPromptTemplate}
      isDirty={isDirty}
      saving={saving}
      saveError={saveError ?? null}
      setSystemPrompt={setSystemPrompt}
      setUserPromptTemplate={setUserPromptTemplate}
      onSave={handleSave}
      feedbacks={mockFeedbacks}
      feedbackTotalCount={mockFeedbacks.length}
    />
  );
}
