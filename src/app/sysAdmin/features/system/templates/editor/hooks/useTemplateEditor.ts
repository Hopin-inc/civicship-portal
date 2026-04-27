"use client";

import { useEffect, useState } from "react";
import {
  GqlReportVariant,
  useGetReportTemplateQuery,
  useUpdateReportTemplateMutation,
} from "@/types/graphql";

export function useTemplateEditor(variant: GqlReportVariant | null) {
  const { data, loading, error, refetch } = useGetReportTemplateQuery({
    variables: variant
      ? { variant }
      : { variant: GqlReportVariant.MemberNewsletter },
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

  const handleSave = async () => {
    if (!variant || !template) return;
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
  };

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
