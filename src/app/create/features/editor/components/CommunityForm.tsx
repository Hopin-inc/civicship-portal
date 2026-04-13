import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { BasicInfoSection } from "./sections/BasicInfoSection";
import { LineConfigSection } from "./sections/LineConfigSection";
import { useCommunityEditor } from "../hooks/useCommunityEditor";

interface CommunityFormProps {
  editor: ReturnType<typeof useCommunityEditor>;
  onSubmit: (e: FormEvent) => void;
}

export function CommunityForm({ editor, onSubmit }: CommunityFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <BasicInfoSection
        formData={editor.formData}
        onChange={editor.setField}
        errors={editor.errors}
        onClearError={editor.clearError}
      />
      <LineConfigSection
        formData={editor.formData}
        onChange={editor.setField}
        errors={editor.errors}
        onClearError={editor.clearError}
      />
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
