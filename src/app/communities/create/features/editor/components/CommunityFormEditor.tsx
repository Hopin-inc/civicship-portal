"use client";

import { FormEvent } from "react";
import { useCommunityEditor } from "../hooks/useCommunityEditor";
import { CommunityForm } from "./CommunityForm";
import { useAuthStore } from "@/lib/auth/core/auth-store";

interface CommunityFormEditorProps {
  onSuccess?: (id: string) => void;
}

export function CommunityFormEditor({ onSuccess }: CommunityFormEditorProps) {
  const editor = useCommunityEditor();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { authenticationState, firebaseUser, lineTokens } = useAuthStore.getState().state;
    console.log("[CommunityFormEditor] submit", {
      authenticationState,
      firebaseUser: !!firebaseUser,
      lineTokensIdToken: !!lineTokens.idToken,
      communityIdCookie: document.cookie.match(/x-community-id=([^;]*)/)?.[1] ?? null,
    });
    const id = await editor.handleSave(editor.formData);
    if (id) {
      onSuccess?.(id);
    }
  };

  return <CommunityForm editor={editor} onSubmit={handleSubmit} />;
}
