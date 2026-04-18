"use client";

import { useMemo } from "react";
import { FormProvider } from "react-hook-form";
import { useTranslations } from "next-intl";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useVoteTopicEditor } from "../hooks/useVoteTopicEditor";
import { useVoteTopicSave } from "../hooks/useVoteTopicSave";
import { useNftTokens } from "../hooks/useNftTokens";
import { VoteTopicForm } from "./VoteTopicForm";
import { VoteTopicFormValues } from "../types/form";

interface VoteTopicFormEditorProps {
  mode: "create" | "update";
  communityId: string;
  topicId?: string;
  initialValues?: VoteTopicFormValues;
  onSuccess?: (id: string) => void;
}

export function VoteTopicFormEditor({
  mode,
  communityId,
  topicId,
  initialValues,
  onSuccess,
}: VoteTopicFormEditorProps) {
  const t = useTranslations();
  const form = useVoteTopicEditor(initialValues);
  const { save, saving } = useVoteTopicSave({ mode, communityId, topicId });
  const { tokens, loading: tokensLoading } = useNftTokens({ communityId });

  const headerConfig = useMemo(
    () => ({
      title: t(
        mode === "create" ? "adminVotes.page.title" : "adminVotes.edit.title",
      ),
      showLogo: false,
      showBackButton: true,
      hideFooter: true,
    }),
    [t, mode],
  );
  useHeaderConfig(headerConfig);

  const handleSubmit = form.handleSubmit(async (values) => {
    if (mode === "create") {
      if (!window.confirm(t("adminVotes.form.createConfirm"))) return;
    }
    const id = await save(values);
    if (id) onSuccess?.(id);
  });

  return (
    <FormProvider {...form}>
      <VoteTopicForm
        mode={mode}
        onSubmit={handleSubmit}
        saving={saving}
        nftTokens={tokens}
        nftTokensLoading={tokensLoading}
      />
    </FormProvider>
  );
}
