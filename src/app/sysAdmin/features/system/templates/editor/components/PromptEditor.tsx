"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GqlReportTemplateFieldsFragment } from "@/types/graphql";

type Props = {
  template: GqlReportTemplateFieldsFragment;
  systemPrompt: string;
  setSystemPrompt: (v: string) => void;
  userPromptTemplate: string;
  setUserPromptTemplate: (v: string) => void;
  onSave: () => void;
  saving: boolean;
  isDirty: boolean;
  saveError?: { message: string } | null;
};

export function PromptEditor({
  template,
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
    <div className="space-y-6">
      <section className="space-y-2">
        <h3 className="text-body-sm font-semibold">設定</h3>
        <dl className="grid grid-cols-[120px_1fr] gap-y-1 text-body-sm">
          <dt className="text-muted-foreground">version</dt>
          <dd>v{template.version}</dd>
          <dt className="text-muted-foreground">scope</dt>
          <dd>{template.scope}</dd>
          <dt className="text-muted-foreground">model</dt>
          <dd className="font-mono text-body-xs">{template.model}</dd>
          <dt className="text-muted-foreground">maxTokens</dt>
          <dd>{template.maxTokens}</dd>
          {template.temperature != null && (
            <>
              <dt className="text-muted-foreground">temperature</dt>
              <dd>{template.temperature}</dd>
            </>
          )}
          <dt className="text-muted-foreground">trafficWeight</dt>
          <dd>{template.trafficWeight}%</dd>
          <dt className="text-muted-foreground">isActive / isEnabled</dt>
          <dd>
            {template.isActive ? "✓" : "−"} / {template.isEnabled ? "✓" : "−"}
          </dd>
        </dl>
      </section>

      <section className="space-y-2">
        <Label htmlFor="systemPrompt" className="text-body-sm font-semibold">
          system prompt
        </Label>
        <Textarea
          id="systemPrompt"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          className="min-h-[200px] font-mono text-body-xs"
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
          className="min-h-[200px] font-mono text-body-xs"
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
