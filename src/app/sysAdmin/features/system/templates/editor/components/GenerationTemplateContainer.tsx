"use client";

import { GqlReportTemplateKind, type GqlReportVariant } from "@/types/graphql";
import { useTemplateBreakdown } from "@/app/sysAdmin/features/system/templates/editor/hooks/useTemplateBreakdown";
import { useTemplateEditor } from "@/app/sysAdmin/features/system/templates/editor/hooks/useTemplateEditor";
import { GenerationTemplateView } from "./GenerationTemplateView";

type Props = {
  variant: GqlReportVariant;
};

/**
 * `GenerationTemplateView` (presentational) と
 * `useTemplateEditor` / `useTemplateBreakdown` (data) を結ぶ container。
 */
export function GenerationTemplateContainer({ variant }: Props) {
  const editor = useTemplateEditor(variant);
  const breakdown = useTemplateBreakdown(variant, GqlReportTemplateKind.Generation);

  return (
    <GenerationTemplateView
      rows={breakdown.rows}
      breakdownLoading={breakdown.loading}
      breakdownError={breakdown.error}
      template={editor.template}
      editorLoading={editor.loading}
      editorError={editor.error}
      systemPrompt={editor.systemPrompt}
      userPromptTemplate={editor.userPromptTemplate}
      isDirty={editor.isDirty}
      saving={editor.saving}
      saveError={editor.saveError ?? null}
      setSystemPrompt={editor.setSystemPrompt}
      setUserPromptTemplate={editor.setUserPromptTemplate}
      onSave={editor.handleSave}
    />
  );
}
