"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared/ErrorState";
import { slugToVariant } from "@/app/sysAdmin/features/system/templates/shared/variantSlug";
import { variantLabel } from "@/app/sysAdmin/features/system/templates/shared/variantLabel";
import { useTemplateEditor } from "@/app/sysAdmin/features/system/templates/editor/hooks/useTemplateEditor";
import { PromptEditor } from "@/app/sysAdmin/features/system/templates/editor/components/PromptEditor";

export default function SysAdminSystemTemplateDetailPage() {
  const params = useParams<{ variant: string }>();
  const variant = slugToVariant(params.variant);
  const editor = useTemplateEditor(variant);

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

  return (
    <div className="max-w-xl mx-auto mt-8 space-y-6 px-4">
      {editor.loading && !editor.template ? (
        <LoadingIndicator fullScreen={false} />
      ) : editor.error && !editor.template ? (
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
    </div>
  );
}
