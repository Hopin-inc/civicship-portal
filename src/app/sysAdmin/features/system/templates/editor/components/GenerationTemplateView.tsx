"use client";

import { useMemo, useState } from "react";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import type {
  GqlReportTemplateFieldsFragment,
  GqlReportTemplateStatsBreakdownRowFieldsFragment,
} from "@/types/graphql";
import { PromptEditor } from "./PromptEditor";
import { StatsSection } from "./StatsSection";
import { ExperimentSection } from "./ExperimentSection";
import { VersionSelector } from "./VersionSelector";

export type GenerationTemplateViewProps = {
  rows: GqlReportTemplateStatsBreakdownRowFieldsFragment[];
  breakdownLoading: boolean;
  breakdownError: unknown;

  template: GqlReportTemplateFieldsFragment | null;
  editorLoading: boolean;
  editorError: unknown;

  systemPrompt: string;
  userPromptTemplate: string;
  isDirty: boolean;
  saving: boolean;
  saveError: { message: string } | null;
  setSystemPrompt: (v: string) => void;
  setUserPromptTemplate: (v: string) => void;
  onSave: () => void;
};

/**
 * GENERATION template の閲覧 + 編集 view (presentational only)。
 * 全ての data / loading / handlers は props で受ける。
 * Storybook ではこのコンポーネントを直接 render し、props を mock する。
 */
export function GenerationTemplateView({
  rows,
  breakdownLoading,
  breakdownError,
  template,
  editorLoading,
  editorError,
  systemPrompt,
  userPromptTemplate,
  isDirty,
  saving,
  saveError,
  setSystemPrompt,
  setUserPromptTemplate,
  onSave,
}: GenerationTemplateViewProps) {
  const versions = useMemo(
    () =>
      Array.from(new Set(rows.map((r) => r.version))).sort((a, b) => b - a),
    [rows],
  );
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const filteredRows = useMemo(
    () =>
      selectedVersion == null
        ? rows
        : rows.filter((r) => r.version === selectedVersion),
    [rows, selectedVersion],
  );

  const isInitialLoading =
    (editorLoading && !template) || (breakdownLoading && rows.length === 0);

  return (
    <div className="space-y-8">
      {isInitialLoading ? (
        <LoadingIndicator fullScreen={false} />
      ) : (
        <>
          {breakdownError ? (
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
          {editorError && !template ? (
            <ErrorState title="テンプレートの取得に失敗しました" />
          ) : !template ? (
            <p className="text-body-sm text-muted-foreground">
              この variant の SYSTEM テンプレートが見つかりません
            </p>
          ) : (
            <PromptEditor
              template={template}
              systemPrompt={systemPrompt}
              setSystemPrompt={setSystemPrompt}
              userPromptTemplate={userPromptTemplate}
              setUserPromptTemplate={setUserPromptTemplate}
              onSave={onSave}
              saving={saving}
              isDirty={isDirty}
              saveError={saveError}
            />
          )}
        </>
      )}
    </div>
  );
}
