"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { slugToVariant } from "@/app/sysAdmin/features/system/templates/shared/variantSlug";
import { variantLabel } from "@/app/sysAdmin/features/system/templates/shared/labels";
import { useTemplateEditor } from "@/app/sysAdmin/features/system/templates/editor/hooks/useTemplateEditor";
import { useTemplateBreakdown } from "@/app/sysAdmin/features/system/templates/editor/hooks/useTemplateBreakdown";
import { PromptEditor } from "@/app/sysAdmin/features/system/templates/editor/components/PromptEditor";
import { StatsSection } from "@/app/sysAdmin/features/system/templates/editor/components/StatsSection";
import { ExperimentSection } from "@/app/sysAdmin/features/system/templates/editor/components/ExperimentSection";
import { VersionSelector } from "@/app/sysAdmin/features/system/templates/editor/components/VersionSelector";

export default function SysAdminSystemTemplateDetailPage() {
  const params = useParams<{ variant: string }>();
  const variant = slugToVariant(params.variant);
  const editor = useTemplateEditor(variant);
  const breakdown = useTemplateBreakdown(variant);

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

  const headerConfig = useMemo(
    () => ({
      title: variant ? variantLabel(variant) : "テンプレート詳細",
      showBackButton: true,
      showLogo: false,
    }),
    [variant],
  );
  useHeaderConfig(headerConfig);

  if (!variant) {
    return (
      <div className="max-w-xl mx-auto mt-8 px-4">
        <ErrorState title={`未対応の variant: ${params.variant}`} />
      </div>
    );
  }

  const isInitialLoading =
    (editor.loading && !editor.template) ||
    (breakdown.loading && breakdown.rows.length === 0);

  return (
    <div className="max-w-xl mx-auto mt-8 space-y-8 px-4">
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
