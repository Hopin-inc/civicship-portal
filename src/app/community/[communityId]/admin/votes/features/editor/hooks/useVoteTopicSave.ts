import { useCallback } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { toast } from "react-toastify";
import { ApolloError } from "@apollo/client";
import { useTranslations } from "next-intl";
import {
  GqlVoteGateType,
  GqlVotePowerPolicyType,
  useCreateVoteTopicMutation,
  useUpdateVoteTopicMutation,
} from "@/types/graphql";
import { logger } from "@/lib/logging";
import { APP_TIMEZONE } from "@/lib/constants";
import { VoteTopicFormValues } from "../types/form";

dayjs.extend(utc);
dayjs.extend(timezone);

interface UseVoteTopicSaveParams {
  mode: "create" | "update";
  communityId: string;
  topicId?: string;
}

function buildInput(values: VoteTopicFormValues) {
  return {
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
}

export function useVoteTopicSave({
  mode,
  communityId,
  topicId,
}: UseVoteTopicSaveParams) {
  const t = useTranslations();
  const [createVoteTopic, { loading: creating }] =
    useCreateVoteTopicMutation();
  const [updateVoteTopic, { loading: updating }] =
    useUpdateVoteTopicMutation();

  const save = useCallback(
    async (values: VoteTopicFormValues): Promise<string | null> => {
      const input = buildInput(values);

      try {
        if (mode === "create") {
          const { data } = await createVoteTopic({
            variables: {
              input: { ...input, communityId },
              permission: { communityId },
            },
          });
          const id = data?.voteTopicCreate?.voteTopic?.id ?? null;
          if (!id) {
            toast.error(t("adminVotes.toast.createError"));
            return null;
          }
          toast.success(t("adminVotes.toast.createSuccess"));
          return id;
        } else {
          if (!topicId) return null;
          const { data } = await updateVoteTopic({
            variables: {
              id: topicId,
              input,
              permission: { communityId },
            },
          });
          const id = data?.voteTopicUpdate?.voteTopic?.id ?? null;
          if (!id) {
            toast.error(t("adminVotes.toast.updateError"));
            return null;
          }
          toast.success(t("adminVotes.toast.updateSuccess"));
          return id;
        }
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : String(error);
        logger.warn(`${mode} vote topic error`, {
          error: errorMsg,
          component: "useVoteTopicSave",
        });
        const gqlErrors =
          error instanceof ApolloError ? error.graphQLErrors : [];
        const isNotEditable = gqlErrors.some(
          (e) => e.extensions?.code === "VOTE_TOPIC_NOT_EDITABLE",
        );
        if (isNotEditable) {
          toast.error(t("adminVotes.toast.notEditableError"));
        } else {
          toast.error(
            t(
              mode === "create"
                ? "adminVotes.toast.createError"
                : "adminVotes.toast.updateError",
            ),
          );
        }
        return null;
      }
    },
    [mode, createVoteTopic, updateVoteTopic, communityId, topicId, t],
  );

  return { save, saving: creating || updating };
}
