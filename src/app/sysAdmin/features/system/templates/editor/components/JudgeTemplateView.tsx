"use client";

import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GqlReportTemplateKind, type GqlReportVariant } from "@/types/graphql";
import { useTemplateBreakdown } from "@/app/sysAdmin/features/system/templates/editor/hooks/useTemplateBreakdown";
import { useActiveJudgeTemplate } from "@/app/sysAdmin/features/system/templates/editor/hooks/useActiveJudgeTemplate";
import { StatsSection } from "./StatsSection";
import { ExperimentSection } from "./ExperimentSection";
import { VersionSelector } from "./VersionSelector";

type Props = {
  variant: GqlReportVariant;
};

/**
 * JUDGE template の閲覧専用ビュー。
 *
 * - StatsSection / VersionSelector / ExperimentSection は GENERATION と同じ。
 * - prompt は read-only な textarea で表示する。
 * - 「JUDGE prompt の編集は seed 投入で運用」警告を常時表示。
 *
 * 将来 backend が `updateReportTemplate` の kind 引数に対応したら、
 * `JudgeWarningModal` を save flow に組み込んで編集可能化する。
 */
export function JudgeTemplateView({ variant }: Props) {
  const breakdown = useTemplateBreakdown(variant, GqlReportTemplateKind.Judge);
  const judge = useActiveJudgeTemplate(variant);

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
    (breakdown.loading && breakdown.rows.length === 0) ||
    (judge.loading && !judge.template);

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-2 rounded border border-destructive/40 bg-destructive/5 p-3">
        <AlertTriangle className="h-4 w-4 shrink-0 text-destructive mt-0.5" />
        <div className="space-y-1 text-body-sm">
          <p className="font-semibold text-destructive">JUDGE template は閲覧専用</p>
          <p className="text-body-xs text-muted-foreground">
            prompt の更新は seed 投入で行ってください。admin UI から編集すると過去の judgeScore との比較が断絶し、評価指標の連続性が崩れます。
          </p>
        </div>
      </div>

      {isInitialLoading ? (
        <LoadingIndicator fullScreen={false} />
      ) : breakdown.error ? (
        <ErrorState title="JUDGE 評価指標の取得に失敗しました" />
      ) : (
        <>
          <StatsSection rows={filteredRows} />
          <VersionSelector
            versions={versions}
            selected={selectedVersion}
            onSelect={setSelectedVersion}
          />
          <ExperimentSection rows={filteredRows} />

          <hr className="border-muted" />

          <h3 className="text-body-sm font-semibold">prompt (read-only / 現行 active 行)</h3>
          {judge.error ? (
            <ErrorState title="JUDGE template の取得に失敗しました" />
          ) : !judge.template ? (
            <p className="text-body-sm text-muted-foreground">
              この variant の JUDGE template は登録されていません
            </p>
          ) : (
            <div className="space-y-6">
              <section className="space-y-2">
                <h4 className="text-body-sm font-semibold">設定</h4>
                <dl className="grid grid-cols-[120px_1fr] gap-y-1 text-body-sm">
                  <dt className="text-muted-foreground">version</dt>
                  <dd>v{judge.template.version}</dd>
                  <dt className="text-muted-foreground">model</dt>
                  <dd className="font-mono text-body-xs">{judge.template.model}</dd>
                  <dt className="text-muted-foreground">maxTokens</dt>
                  <dd>{judge.template.maxTokens}</dd>
                  {judge.template.temperature != null && (
                    <>
                      <dt className="text-muted-foreground">temperature</dt>
                      <dd>{judge.template.temperature}</dd>
                    </>
                  )}
                </dl>
              </section>
              <section className="space-y-2">
                <Label htmlFor="judgeSystemPrompt" className="text-body-sm font-semibold">
                  system prompt
                </Label>
                <Textarea
                  id="judgeSystemPrompt"
                  value={judge.template.systemPrompt}
                  readOnly
                  className="min-h-[200px] font-mono text-body-xs"
                />
              </section>
              <section className="space-y-2">
                <Label htmlFor="judgeUserPrompt" className="text-body-sm font-semibold">
                  user prompt template
                </Label>
                <Textarea
                  id="judgeUserPrompt"
                  value={judge.template.userPromptTemplate}
                  readOnly
                  className="min-h-[200px] font-mono text-body-xs"
                />
              </section>
            </div>
          )}
        </>
      )}
    </div>
  );
}
