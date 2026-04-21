import {
  GqlGetVoteTopicsQuery,
  GqlRole,
  GqlVoteGateType,
  GqlVotePowerPolicyType,
} from "@/types/graphql";
import { VoteListItem, GateSummary, PowerPolicySummary } from "../types/VoteListItem";

type VoteTopicNode = NonNullable<
  GqlGetVoteTopicsQuery["voteTopics"]["edges"][number]["node"]
>;

function toGateSummary(gate: VoteTopicNode["gate"]): GateSummary {
  if (gate.type === GqlVoteGateType.Nft) {
    return { type: "nft", tokenName: gate.nftToken?.name ?? null };
  }
  return {
    type: "membership",
    requiredRole: gate.requiredRole ?? GqlRole.Member,
  };
}

function toPowerPolicySummary(
  powerPolicy: VoteTopicNode["powerPolicy"],
): PowerPolicySummary {
  if (powerPolicy.type === GqlVotePowerPolicyType.NftCount) {
    return { type: "nftCount", tokenName: powerPolicy.nftToken?.name ?? null };
  }
  return { type: "flat" };
}

export function presentVoteList(
  connection: GqlGetVoteTopicsQuery["voteTopics"],
): VoteListItem[] {
  return connection.edges
    .map((edge) => edge.node)
    .filter((n): n is VoteTopicNode => Boolean(n))
    .map((node) => ({
      id: node.id,
      title: node.title,
      startsAt: node.startsAt,
      endsAt: node.endsAt,
      phase: node.phase,
      optionCount: node.options.length,
      gateSummary: toGateSummary(node.gate),
      powerPolicySummary: toPowerPolicySummary(node.powerPolicy),
    }));
}
