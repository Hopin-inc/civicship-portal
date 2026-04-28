"use client";

import { FormEvent } from "react";
import { useCommunityEditor } from "../hooks/useCommunityEditor";
import { CommunityForm } from "./CommunityForm";

interface CommunityFormEditorProps {
  onSuccess?: (id: string) => void;
}

export function CommunityFormEditor({ onSuccess }: CommunityFormEditorProps) {
  const editor = useCommunityEditor();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const id = await editor.handleSave(editor.formData);
    if (id) {
      onSuccess?.(id);
    }
  };

  return <CommunityForm editor={editor} onSubmit={handleSubmit} />;
}
