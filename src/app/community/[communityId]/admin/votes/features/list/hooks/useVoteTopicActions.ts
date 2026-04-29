"use client";

import { useCallback } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { useAppRouter } from "@/lib/navigation";
import { useDeleteVoteTopicMutation } from "@/types/graphql";
import { logger } from "@/lib/logging";

interface UseVoteTopicActionsParams {
  communityId: string;
  refetch?: () => void;
}

interface UseVoteTopicActionsReturn {
  handleEdit: (voteTopicId: string) => void;
  handleDelete: (voteTopicId: string) => Promise<void>;
}

export function useVoteTopicActions({
  communityId,
  refetch,
}: UseVoteTopicActionsParams): UseVoteTopicActionsReturn {
  const t = useTranslations();
  const router = useAppRouter();
  const [deleteVoteTopic] = useDeleteVoteTopicMutation();

  const handleEdit = useCallback(
    (voteTopicId: string) => {
      router.push(`/admin/votes/${voteTopicId}/edit`);
    },
    [router],
  );

  const handleDelete = useCallback(
    async (voteTopicId: string) => {
      if (!window.confirm(t("adminVotes.list.deleteConfirm"))) return;
      try {
        await deleteVoteTopic({
          variables: {
            id: voteTopicId,
            permission: { communityId },
          },
        });
        toast.success(t("adminVotes.toast.deleteSuccess"));
        refetch?.();
      } catch (error) {
        logger.warn("Failed to delete vote topic", {
          error: error instanceof Error ? error.message : String(error),
          voteTopicId,
          component: "useVoteTopicActions",
        });
        toast.error(t("adminVotes.toast.deleteError"));
      }
    },
    [communityId, deleteVoteTopic, refetch, t],
  );

  return { handleEdit, handleDelete };
}
