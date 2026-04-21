import {
  GqlGetVoteTopicQuery,
  GqlRole,
  GqlVoteGateType,
  GqlVotePowerPolicyType,
} from "@/types/graphql";
import {
  VoteDetailView,
  VoteDetailGate,
  VoteDetailPowerPolicy,
} from "../types/VoteDetailView";

type VoteTopicData = NonNullable<GqlGetVoteTopicQuery["voteTopic"]>;

function toGate(gate: VoteTopicData["gate"]): VoteDetailGate {
  if (gate.type === GqlVoteGateType.Nft) {
    return { type: "nft", tokenName: gate.nftToken?.name ?? null };
  }
  return {
    type: "membership",
    requiredRole: gate.requiredRole ?? GqlRole.Member,
  };
}

function toPowerPolicy(
  pp: VoteTopicData["powerPolicy"],
): VoteDetailPowerPolicy {
  if (pp.type === GqlVotePowerPolicyType.NftCount) {
    return { type: "nftCount", tokenName: pp.nftToken?.name ?? null };
  }
  return { type: "flat" };
}

export function presentVoteDetail(topic: VoteTopicData): VoteDetailView {
  return {
    id: topic.id,
    title: topic.title,
    description: topic.description ?? null,
    startsAt: topic.startsAt,
    endsAt: topic.endsAt,
    phase: topic.phase,
    options: [...topic.options]
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((o) => ({
        id: o.id,
        label: o.label,
        voteCount: o.voteCount ?? null,
        totalPower: o.totalPower ?? null,
      })),
    gate: toGate(topic.gate),
    powerPolicy: toPowerPolicy(topic.powerPolicy),
  };
}
