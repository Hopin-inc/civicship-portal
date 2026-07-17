"use client";

import { useMemo, useState } from "react";
import { FormProvider } from "react-hook-form";
import { useTranslations } from "next-intl";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useVoteTopicEditor } from "../hooks/useVoteTopicEditor";
import { useVoteTopicSave } from "../hooks/useVoteTopicSave";
import { useNftTokens } from "../hooks/useNftTokens";
import { VoteTopicForm } from "./VoteTopicForm";
import { VoteTopicFormValues } from "../types/form";
import { ConfirmDialog } from "../../shared/components/ConfirmDialog";

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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<VoteTopicFormValues | null>(null);

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

  const runSave = async (values: VoteTopicFormValues): Promise<boolean> => {
    const id = await save(values);
    if (!id) return false;
    onSuccess?.(id);
    return true;
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    if (mode === "create") {
      setPendingValues(values);
      setConfirmOpen(true);
      return;
    }
    await runSave(values);
  });

  const handleConfirm = async () => {
    // saving 中の連打によるダブルサブミットを防ぐ（ボタンの disabled が
    // 反映される前の隙間対策）。
    if (!pendingValues || saving) return;
    // 保存が成功したときのみ閉じる。失敗時はダイアログを開いたままにして
    // 再試行/キャンセルできるようにする（削除フローと挙動を揃える）。
    const ok = await runSave(pendingValues);
    if (ok) {
      setConfirmOpen(false);
      setPendingValues(null);
    }
  };

  return (
    <FormProvider {...form}>
      <VoteTopicForm
        mode={mode}
        onSubmit={handleSubmit}
        saving={saving}
        nftTokens={tokens}
        nftTokensLoading={tokensLoading}
      />
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (saving) return;
          setConfirmOpen(open);
          // 閉じるときは保留中の入力値も破棄する（古い値での保存を防ぐ）
          if (!open) setPendingValues(null);
        }}
        title={t("adminVotes.list.createButton")}
        description={t("adminVotes.form.createConfirm")}
        confirmLabel={saving ? t("adminVotes.form.submitting") : t("adminVotes.form.submitButton")}
        cancelLabel={t("adminVotes.common.cancel")}
        onConfirm={handleConfirm}
        confirming={saving}
      />
    </FormProvider>
  );
}
