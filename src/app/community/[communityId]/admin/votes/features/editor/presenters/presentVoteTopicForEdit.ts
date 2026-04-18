import dayjs from "dayjs";
import {
  GqlGetVoteTopicQuery,
  GqlRole,
  GqlVoteGateType,
  GqlVotePowerPolicyType,
} from "@/types/graphql";
import { VoteTopicFormValues } from "../types/form";

type VoteTopicData = NonNullable<GqlGetVoteTopicQuery["voteTopic"]>;

export function presentVoteTopicForEdit(
  topic: VoteTopicData,
): VoteTopicFormValues {
  return {
    title: topic.title,
    description: topic.description ?? "",
    startsAt: dayjs(topic.startsAt).format("YYYY-MM-DDTHH:mm"),
    endsAt: dayjs(topic.endsAt).format("YYYY-MM-DDTHH:mm"),
    options: [...topic.options]
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((o) => ({ label: o.label })),
    gate:
      topic.gate.type === GqlVoteGateType.Nft
        ? {
            type: GqlVoteGateType.Nft,
            requiredRole: null,
            nftTokenId: topic.gate.nftToken?.id ?? "",
          }
        : {
            type: GqlVoteGateType.Membership,
            requiredRole: topic.gate.requiredRole ?? GqlRole.Member,
            nftTokenId: null,
          },
    powerPolicy:
      topic.powerPolicy.type === GqlVotePowerPolicyType.NftCount
        ? {
            type: GqlVotePowerPolicyType.NftCount,
            nftTokenId: topic.powerPolicy.nftToken?.id ?? "",
          }
        : {
            type: GqlVotePowerPolicyType.Flat,
            nftTokenId: null,
          },
  };
}
