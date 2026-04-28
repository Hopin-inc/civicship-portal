"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Props = {
  systemPrompt: string;
  setSystemPrompt: (v: string) => void;
  userPromptTemplate: string;
  setUserPromptTemplate: (v: string) => void;
  onSave: () => void;
  saving: boolean;
  isDirty: boolean;
  saveError?: { message: string } | null;
};

/**
 * Prompt 編集の主役 UI。
 * version / model / experimentKey 等のメタデータは ExperimentSection
 * の table と重複するため、ここでは表示しない (= 親 View が inline 1 行
 * のヘッダで集約表示する)。
 */
export function PromptEditor({
  systemPrompt,
  setSystemPrompt,
  userPromptTemplate,
  setUserPromptTemplate,
  onSave,
  saving,
  isDirty,
  saveError,
}: Props) {
  return (
    <div className="space-y-4">
      <section className="space-y-2">
        <Label htmlFor="systemPrompt" className="text-body-sm font-semibold">
          system prompt
        </Label>
        <Textarea
          id="systemPrompt"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          className="min-h-[240px] font-mono text-body-xs"
          disabled={saving}
        />
      </section>

      <section className="space-y-2">
        <Label htmlFor="userPromptTemplate" className="text-body-sm font-semibold">
          user prompt template
        </Label>
        <Textarea
          id="userPromptTemplate"
          value={userPromptTemplate}
          onChange={(e) => setUserPromptTemplate(e.target.value)}
          className="min-h-[240px] font-mono text-body-xs"
          disabled={saving}
        />
      </section>

      {saveError && (
        <p className="text-body-sm text-destructive">
          保存に失敗しました: {saveError.message}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Button
          variant="primary"
          size="sm"
          onClick={onSave}
          disabled={!isDirty || saving}
        >
          {saving ? "保存中..." : isDirty ? "保存" : "変更なし"}
        </Button>
      </div>
    </div>
  );
}
