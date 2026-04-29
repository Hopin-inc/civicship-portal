import { GqlGetVoteTopicForUserQuery, GqlVoteGateType, GqlVoteTopicPhase } from "@/types/graphql";
import { DisplayMode, VoteCastViewModel, VoteGateInfo } from "../types/VoteCastViewModel";

type VoteTopicData = NonNullable<GqlGetVoteTopicForUserQuery["voteTopic"]>;

function computeDisplayMode(topic: VoteTopicData): DisplayMode {
  if (topic.phase === GqlVoteTopicPhase.Upcoming) return "upcoming";
  if (topic.phase === GqlVoteTopicPhase.Closed) return "closed";
  if (!topic.myEligibility?.eligible) return "ineligible";
  return "cast";
}

function toGateInfo(gate: VoteTopicData["gate"]): VoteGateInfo {
  if (gate.type === GqlVoteGateType.Nft) {
    return {
      type: "nft",
      requiredRoleLabel: null,
      nftTokenName: gate.nftToken?.name ?? null,
    };
  }
  return {
    type: "membership",
    requiredRoleLabel: gate.requiredRole ?? null,
    nftTokenName: null,
  };
}

export function presentVoteCastView(topic: VoteTopicData): VoteCastViewModel {
  const ballot = topic.myBallot ?? null;
  const eligibility = topic.myEligibility ?? null;

  return {
    topicId: topic.id,
    title: topic.title,
    description: topic.description ?? null,
    startsAt: topic.startsAt,
    endsAt: topic.endsAt,
    phase: topic.phase,
    displayMode: computeDisplayMode(topic),
    options: [...topic.options]
      .sort((a, b) => a.orderIndex - b.orderIndex)
      .map((o) => ({
        id: o.id,
        label: o.label,
        voteCount: o.voteCount ?? null,
        totalPower: o.totalPower ?? null,
      })),
    currentPower: eligibility?.currentPower ?? null,
    myBallotOptionId: ballot?.option.id ?? null,
    myBallotPower: ballot?.power ?? null,
    myBallotLabel: ballot?.option.label ?? null,
    reason: eligibility?.reason ?? null,
    gate: toGateInfo(topic.gate),
  };
}
