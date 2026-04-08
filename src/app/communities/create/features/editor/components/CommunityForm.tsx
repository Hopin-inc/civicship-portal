import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { BasicInfoSection } from "./sections/BasicInfoSection";
import { MetaSection } from "./sections/MetaSection";
import { LineConfigSection } from "./sections/LineConfigSection";
import { useCommunityEditor } from "../hooks/useCommunityEditor";

interface CommunityFormProps {
  editor: ReturnType<typeof useCommunityEditor>;
  onSubmit: (e: FormEvent) => void;
}

export function CommunityForm({ editor, onSubmit }: CommunityFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* === セクション1: 基本情報 === */}
      <BasicInfoSection
        formData={editor.formData}
        onChange={editor.setField}
        errors={editor.errors}
        onClearError={editor.clearError}
      />

      {/* === セクション2: メタ情報 === */}
      <MetaSection formData={editor.formData} onChange={editor.setField} />

      {/* === セクション3: LINE設定 === */}
      <LineConfigSection
        formData={editor.formData}
        onChange={editor.setField}
        errors={editor.errors}
        onClearError={editor.clearError}
      />

      {/* 送信ボタン */}
      <div className="w-full max-w-[345px] mx-auto pb-8">
        <Button
          type="submit"
          variant="primary"
          className="w-full h-[56px]"
          disabled={editor.saving}
        >
          {editor.saving ? "作成中..." : "作成"}
        </Button>
      </div>
    </form>
  );
}
