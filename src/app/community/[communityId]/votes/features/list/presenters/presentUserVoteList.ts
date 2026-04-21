import { GqlGetVoteTopicsForUserQuery, GqlVoteTopicPhase } from "@/types/graphql";
import { UserVoteListItem } from "../types/UserVoteListItem";

type Edge = GqlGetVoteTopicsForUserQuery["voteTopics"]["edges"][number];

const PHASE_ORDER: Record<GqlVoteTopicPhase, number> = {
  OPEN: 0,
  UPCOMING: 1,
  CLOSED: 2,
};

export function presentUserVoteList(
  connection: GqlGetVoteTopicsForUserQuery["voteTopics"],
): UserVoteListItem[] {
  return connection.edges
    .map((edge: Edge) => edge.node)
    .filter((n): n is NonNullable<typeof n> => Boolean(n))
    .map((node) => ({
      id: node.id,
      title: node.title,
      startsAt: node.startsAt,
      endsAt: node.endsAt,
      phase: node.phase,
      optionCount: node.options.length,
      myBallotLabel: node.myBallot?.option.label ?? null,
      isEligible: node.myEligibility?.eligible ?? true,
    }))
    .sort((a, b) => (PHASE_ORDER[a.phase] ?? 9) - (PHASE_ORDER[b.phase] ?? 9));
}
