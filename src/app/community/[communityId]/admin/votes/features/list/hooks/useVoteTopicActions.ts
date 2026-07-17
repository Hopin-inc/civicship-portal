"use client";

import { useCallback } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { useAppRouter } from "@/lib/navigation";
import { useDeleteVoteTopicMutation } from "@/types/graphql";
import { logger } from "@/lib/logging";

interface UseVoteTopicActionsParams {
  refetch?: () => void;
}

interface UseVoteTopicActionsReturn {
  handleEdit: (voteTopicId: string) => void;
  handleDelete: (voteTopicId: string) => Promise<boolean>;
  deleting: boolean;
}

export function useVoteTopicActions({
  refetch,
}: UseVoteTopicActionsParams = {}): UseVoteTopicActionsReturn {
  const t = useTranslations();
  const router = useAppRouter();
  const [deleteVoteTopic, { loading: deleting }] = useDeleteVoteTopicMutation();

  const handleEdit = useCallback(
    (voteTopicId: string) => {
      router.push(`/admin/votes/${voteTopicId}/edit`);
    },
    [router],
  );

  const handleDelete = useCallback(
    async (voteTopicId: string): Promise<boolean> => {
      try {
        await deleteVoteTopic({
          variables: { id: voteTopicId },
        });
        toast.success(t("adminVotes.toast.deleteSuccess"));
        refetch?.();
        return true;
      } catch (error) {
        logger.warn("Failed to delete vote topic", {
          error: error instanceof Error ? error.message : String(error),
          voteTopicId,
          component: "useVoteTopicActions",
        });
        toast.error(t("adminVotes.toast.deleteError"));
        return false;
      }
    },
    [deleteVoteTopic, refetch, t],
  );

  return { handleEdit, handleDelete, deleting };
}
