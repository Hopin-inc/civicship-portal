"use client";

import { useCallback } from "react";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { useVoteCastMutation } from "@/types/graphql";
import { logger } from "@/lib/logging";

export function useVoteCast() {
  const t = useTranslations();
  const [voteCast, { loading }] = useVoteCastMutation({
    refetchQueries: ["GetVoteTopicForUser"],
  });

  const cast = useCallback(
    async (topicId: string, optionId: string) => {
      try {
        const { data } = await voteCast({
          variables: { input: { topicId, optionId } },
        });
        const ballot = data?.voteCast?.ballot ?? null;
        if (ballot) {
          toast.success(t("votes.toast.castSuccess"));
        }
        return ballot;
      } catch (error) {
        logger.warn("Vote cast error", {
          error: error instanceof Error ? error.message : String(error),
          topicId,
          optionId,
          component: "useVoteCast",
        });
        toast.error(t("votes.toast.castError"));
        return null;
      }
    },
    [voteCast, t],
  );

  return { cast, casting: loading };
}
