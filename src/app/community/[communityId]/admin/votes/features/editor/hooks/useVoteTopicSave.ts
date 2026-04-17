import { useCallback } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import {
  GqlVoteGateType,
  GqlVotePowerPolicyType,
  GqlVoteTopicCreateInput,
  useCreateVoteTopicMutation,
} from "@/types/graphql";
import { logger } from "@/lib/logging";
import { VoteTopicFormValues } from "../types/form";

dayjs.extend(utc);
dayjs.extend(timezone);

const APP_TIMEZONE = "Asia/Tokyo";

interface UseVoteTopicSaveParams {
  communityId: string;
}

export function useVoteTopicSave({ communityId }: UseVoteTopicSaveParams) {
  const t = useTranslations();
  const [createVoteTopic, { loading }] = useCreateVoteTopicMutation();

  const save = useCallback(
    async (values: VoteTopicFormValues): Promise<string | null> => {
      try {
        const input: GqlVoteTopicCreateInput = {
          communityId,
          title: values.title.trim(),
          description: values.description.trim() || undefined,
          startsAt: dayjs.tz(values.startsAt, APP_TIMEZONE).toDate(),
          endsAt: dayjs.tz(values.endsAt, APP_TIMEZONE).toDate(),
          options: values.options.map((option, index) => ({
            label: option.label.trim(),
            orderIndex: index,
          })),
          gate:
            values.gate.type === GqlVoteGateType.Nft
              ? {
                  type: GqlVoteGateType.Nft,
                  nftTokenId: values.gate.nftTokenId,
                }
              : {
                  type: GqlVoteGateType.Membership,
                  requiredRole: values.gate.requiredRole,
                },
          powerPolicy:
            values.powerPolicy.type === GqlVotePowerPolicyType.NftCount
              ? {
                  type: GqlVotePowerPolicyType.NftCount,
                  nftTokenId: values.powerPolicy.nftTokenId,
                }
              : {
                  type: GqlVotePowerPolicyType.Flat,
                },
        };

        const { data } = await createVoteTopic({
          variables: {
            input,
            permission: { communityId },
          },
        });

        const topicId = data?.voteTopicCreate?.voteTopic?.id ?? null;
        if (!topicId) {
          toast.error(t("adminVotes.toast.createError"));
          return null;
        }
        toast.success(t("adminVotes.toast.createSuccess"));
        return topicId;
      } catch (error) {
        logger.warn("Create vote topic error", {
          error: error instanceof Error ? error.message : String(error),
          component: "useVoteTopicSave",
        });
        toast.error(t("adminVotes.toast.createError"));
        return null;
      }
    },
    [createVoteTopic, communityId, t],
  );

  return { save, saving: loading };
}
