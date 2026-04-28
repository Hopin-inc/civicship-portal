"use client";

import { useCallback, useEffect, useState } from "react";
import {
  useGetReportTemplateQuery,
  useUpdateReportTemplateMutation,
  type GqlReportVariant,
} from "@/types/graphql";

export function useTemplateEditor(variant: GqlReportVariant | null) {
  const { data, loading, error, refetch } = useGetReportTemplateQuery({
    // skip: !variant のため null 時は呼ばれない。non-null assertion で安全。
    variables: { variant: variant! },
    skip: !variant,
    fetchPolicy: "cache-and-network",
  });

  const template = data?.reportTemplate ?? null;
  const [systemPrompt, setSystemPrompt] = useState("");
  const [userPromptTemplate, setUserPromptTemplate] = useState("");

  useEffect(() => {
    if (template) {
      setSystemPrompt(template.systemPrompt);
      setUserPromptTemplate(template.userPromptTemplate);
    }
  }, [template]);

  const [save, { loading: saving, error: saveError }] = useUpdateReportTemplateMutation();

  const handleSave = useCallback(async () => {
    if (!variant || !template) return;
    // ボタン onClick から呼ばれて promise が捨てられるため、ここで例外を握る。
    // mutation のエラーは Apollo の `saveError` 経由で UI に伝わる。
    // refetch のエラーは画面状態にだけ影響するので silent fail で十分。
    try {
      await save({
        variables: {
          variant,
          input: {
            model: template.model,
            maxTokens: template.maxTokens,
            temperature: template.temperature ?? undefined,
            stopSequences: template.stopSequences,
            systemPrompt,
            userPromptTemplate,
            experimentKey: template.experimentKey ?? undefined,
            isActive: template.isActive,
            isEnabled: template.isEnabled,
            trafficWeight: template.trafficWeight,
            communityContext: template.communityContext ?? undefined,
          },
        },
      });
      await refetch();
    } catch {
      // saveError state でハンドル済み
    }
  }, [variant, template, save, systemPrompt, userPromptTemplate, refetch]);

  const isDirty =
    template != null &&
    (systemPrompt !== template.systemPrompt ||
      userPromptTemplate !== template.userPromptTemplate);

  return {
    loading,
    error,
    template,
    systemPrompt,
    setSystemPrompt,
    userPromptTemplate,
    setUserPromptTemplate,
    handleSave,
    saving,
    saveError,
    isDirty,
  };
}
