"use client";

import { useMemo, useState } from "react";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { GqlReportTemplateKind, type GqlReportVariant } from "@/types/graphql";
import { useTemplateBreakdown } from "@/app/sysAdmin/features/system/templates/editor/hooks/useTemplateBreakdown";
import { useTemplateEditor } from "@/app/sysAdmin/features/system/templates/editor/hooks/useTemplateEditor";
import { PromptEditor } from "./PromptEditor";
import { StatsSection } from "./StatsSection";
import { ExperimentSection } from "./ExperimentSection";
import { VersionSelector } from "./VersionSelector";

type Props = {
  variant: GqlReportVariant;
};

/**
 * GENERATION template の編集ビュー。
 * Stats / VersionSelector / Experiment + prompt 編集 (現行 active 行)。
 */
export function GenerationTemplateView({ variant }: Props) {
  const editor = useTemplateEditor(variant);
  const breakdown = useTemplateBreakdown(variant, GqlReportTemplateKind.Generation);

  const versions = useMemo(
    () =>
      Array.from(new Set(breakdown.rows.map((r) => r.version))).sort(
        (a, b) => b - a,
      ),
    [breakdown.rows],
  );
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const filteredRows = useMemo(
    () =>
      selectedVersion == null
        ? breakdown.rows
        : breakdown.rows.filter((r) => r.version === selectedVersion),
    [breakdown.rows, selectedVersion],
  );

  const isInitialLoading =
    (editor.loading && !editor.template) ||
    (breakdown.loading && breakdown.rows.length === 0);

  return (
    <div className="space-y-8">
      {isInitialLoading ? (
        <LoadingIndicator fullScreen={false} />
      ) : (
        <>
          {breakdown.error ? (
            <ErrorState title="評価指標の取得に失敗しました" />
          ) : (
            <>
              <StatsSection rows={filteredRows} />
              <VersionSelector
                versions={versions}
                selected={selectedVersion}
                onSelect={setSelectedVersion}
              />
              <ExperimentSection rows={filteredRows} />
            </>
          )}

          <hr className="border-muted" />

          <h3 className="text-body-sm font-semibold">prompt 編集 (現行 active 行)</h3>
          {editor.error && !editor.template ? (
            <ErrorState title="テンプレートの取得に失敗しました" />
          ) : !editor.template ? (
            <p className="text-body-sm text-muted-foreground">
              この variant の SYSTEM テンプレートが見つかりません
            </p>
          ) : (
            <PromptEditor
              template={editor.template}
              systemPrompt={editor.systemPrompt}
              setSystemPrompt={editor.setSystemPrompt}
              userPromptTemplate={editor.userPromptTemplate}
              setUserPromptTemplate={editor.setUserPromptTemplate}
              onSave={editor.handleSave}
              saving={editor.saving}
              isDirty={editor.isDirty}
              saveError={editor.saveError ?? null}
            />
          )}
        </>
      )}
    </div>
  );
}
